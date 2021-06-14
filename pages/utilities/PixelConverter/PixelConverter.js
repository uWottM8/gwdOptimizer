import converterData from './PixelConverter.json';
import { JSDOM } from "jsdom";
import CssParser from "../CssParser/CssParser";
import beautifier from 'js-beautify';

class PixelConverter {
    #defaultSettings = {
        ...converterData,
    }

    #settings = {};

    // constructor({ styleSheets: { cssRules, cssAnimations }, document, settings = {} }) {
    constructor(settings) {
        this.#settings = { ...settings, ...this.#defaultSettings };
        //this.document = new JSDOM().window.document;
        // this.cssRules = { ...cssRules };
        // this.cssAnimations = { ...cssAnimations };
        // this.document = document;
        // this.#initSelectorToElementConnections();
        // this.#calcContainerSizes();
    }

    #initSelectorToElementConnections() {
        for (const selector in this.cssRules) {
            selector
                .split(',')
                .map((str) => str.trim())
                .forEach((selector) => this.#attachSelectorToElement(selector));
        }
    }

    #attachSelectorToElement(selector) {
        console.log({selector});

        const element = this.document.querySelector(selector);
        if (!element) {
            console.log('\x1b[31m',
                'Could not find element to selector:',
                '\x1b[0m',
                selector,
                '\x1b[33m',
                'Removing',
                '\x1b[0m');
            delete this.cssRules[selector];
            return;
        }
        if (!element.selectors) {
            element.selectors = [];
        }
        element.selectors.push(selector);
    }

    //придумать другой алгоритм для вычисления максимальной ширины и высоты контейнера
    #calcContainerSizes(startElement = this.document.body) {

        if (!this.containerSizes) {
            this.containerSizes = { width: 0, height: 0 };
        }

        if (!startElement.children) {
            return;
        }

        const borderBoxParams = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            width: 0,
            height: 0
        }

        const { selectors } = startElement;

        // if (selectors) {
        //     const cssRules = selectors
        //         .map((selector) => this.cssRules[selector])
        //         .reduce((obj, rules) => ({...obj, ...rules}), {});

        //     for (const param in borderBoxParams) {
        //         if (!(param in cssRules)) {
        //             continue;
        //         }
        //         const value = cssRules[param]
        //         const parsedValue = value.includes('px') ? parseFloat(value) : 0;
        //         borderBoxParams[param] = parsedValue;
        //     }
        // }

        // const calculatedWidth = borderBoxParams.width + borderBoxParams.left - borderBoxParams.right;
        // const calculatedHeight = borderBoxParams.height + borderBoxParams.top - borderBoxParams.bottom;

        // this.containerSizes.width = Math.max(calculatedWidth, this.containerSizes.width);
        // this.containerSizes.height = Math.max(calculatedHeight, this.containerSizes.height);

        if (selectors) {
            selectors.forEach((selector) => {
                const selectorRules = this.cssRules[selector];
                if ('width' in selectorRules) {
                    const { width: newWidth } = selectorRules;
                    if (newWidth.includes('px')) {
                        const parsedWidth = parseFloat(newWidth)
                        const { width: currentWidth } = this.containerSizes;
                        this.containerSizes.width = Math.max(parsedWidth, currentWidth);
                    }

                }
                if ('height' in selectorRules) {
                    const { height: newHeight } = selectorRules;
                    if (newHeight.includes('px')) {
                        const parsedHeight = parseFloat(newHeight);
                        const { height: currentHeight } = this.containerSizes;
                        this.containerSizes.height = Math.max(parsedHeight, currentHeight);
                    }

                }
            });
        }

        const children = [...startElement.children];
        children.forEach((child) => this.#calcContainerSizes(child));
    }

    #convertSimpleCssValue(value, baseValue) {
        if (!value.includes('px')) {
            return value;
        };

        const parsedValue = parseFloat(value);
        return `${((parsedValue / baseValue * 100).toFixed(3))}%`
    }

    #convertComplexCssValue(cssValue, baseWidth, baseHeight, divider) {
        const { complexValue: complexValuePattern } = this.#settings.parsePatterns;
        const complexValueRegExp = new RegExp(JSON.parse(complexValuePattern), 'g')

        const cssConvertedPropValue = cssValue
            .match(complexValueRegExp)
            .map((strValue, i) => {
                const parentValue = i % 2 === 0 ? baseWidth : baseHeight; //каждое первое значение завиист от высоту, второе - от ширины
                return this.#convertSimpleCssValue(strValue, parentValue)
            }).join(divider);

        return cssConvertedPropValue;
    }

    #convertFunctionalCssValue(cssFuncCallStr, baseWidth, baseHeight) {
        const { functionName: functionNamePattern } = this.#settings.parsePatterns;

        const cssFuncName = cssFuncCallStr.match(new RegExp(JSON.parse(functionNamePattern)))[0];
        const cssFuncConfig = this.#settings.cssFunctionsDescriptions[cssFuncName];

        // console.log('cssFuncConfig', cssFuncConfig);

        if (!cssFuncConfig) { //если функция непереводима
            return cssFuncCallStr;
        }

        const { isVolumable: isCssFuncVolumable } = cssFuncConfig;

        const funcValueToConvert = isCssFuncVolumable
            ? cssFuncCallStr.slice(cssFuncName.length + 1, cssFuncCallStr.lastIndexOf(',')).trim()
            : cssFuncCallStr

        const funcValueNotToConvert = isCssFuncVolumable
            ? `, ${cssFuncCallStr.slice(cssFuncCallStr.lastIndexOf(',') + 1, cssFuncCallStr.indexOf(')')).trim()}`
            : ''


        // console.log('funcValueToConvert', funcValueToConvert, 'funcValueNotToConvert', funcValueNotToConvert)

        const convertedValue = this.#convertComplexCssValue(funcValueToConvert, baseWidth, baseHeight, ', ');

        return `${cssFuncName}(${convertedValue}${funcValueNotToConvert})`;
    }

    #convertFunctionalComplexCssValue(cssValue, baseWidth, baseHeight) {

        const { functionCall: functionCallPattern } = this.#settings.parsePatterns;

        const functionCalls = cssValue.match(new RegExp(JSON.parse(functionCallPattern), "g"));

        // console.log('functionCalls', functionCalls);

        const parsedValues = functionCalls
            .map((cssFuncCallStr) => this.#convertFunctionalCssValue(cssFuncCallStr, baseWidth, baseHeight))
            .join(' ');


        return parsedValues;
    }

    #convertSingleCssRule(cssValue, { baseWidth, baseHeight }, { dependentsOn, isComplex, isFunctional }) {

        console.log('cssRule', cssValue);

        if (!isComplex) { //если значение некомплексное, парсинг простой

            // console.log('convertSimpleCssValue', cssValue);

            return this.#convertSimpleCssValue(cssValue,
                dependentsOn === 'width'
                    ? baseWidth
                    : baseHeight);
        }

        if (!isFunctional) { //если значение не содержит функций, парсинг чуть сложнее
            // console.log('convertComplexCssValue', cssValue);

            return this.#convertComplexCssValue(cssValue, baseWidth, baseHeight, ' ');
        }

        // console.log('convertFunctionalComplexCssValue', cssValue);

        return this.#convertFunctionalComplexCssValue(cssValue, baseWidth, baseHeight);
    }

    #convertCssAnimation(animationPropValue, currentElementSizesInPx, parentSizes) {
        console.log()
        console.log('cssAnimation');

        const animationName = animationPropValue.split(' ').find((str) => str in this.cssAnimations); //узнаем, что является именем анимации
        const animationObj = this.cssAnimations[animationName];
        for (const animationName in animationObj) {
            const elementRules = animationObj[animationName];
            this.#rewriteElementCssRules(elementRules, currentElementSizesInPx, parentSizes);
        }
    }

    #rewriteElementCssRules(elementRules, currentElementSizesInPx, parentSizes) {
        for (const cssProp in elementRules) {
            const dependencyInfo = this.#settings.cssPropsDescriptions[cssProp];
            if (!dependencyInfo) { //если значения свойства непереводимы
                continue;
            } else {
                const cssValue = elementRules[cssProp];
                const { dependencyOwner } = dependencyInfo;
                const baseSizes = dependencyOwner === 'parent'
                    ? { baseWidth: parentSizes.width, baseHeight: parentSizes.height }
                    : { baseWidth: currentElementSizesInPx.width, baseHeight: currentElementSizesInPx.height };
                
                    if (cssProp === 'animation') {
                        this.#convertCssAnimation(cssValue, currentElementSizesInPx, parentSizes);
                    } else {
                        const convertedPropValue = this.#convertSingleCssRule(cssValue, baseSizes, dependencyInfo);
                        elementRules[cssProp] = convertedPropValue;
                    }
            }
        }
    }

    #convertPixelsToPercents(startElement = this.document.body, parentSizes = null) {
        const startIsRoot = startElement === this.document.body;
        const { selectors } = startElement;
        if (!selectors && !startIsRoot) {
            console.log('no selectors');
            return;
        }

        const currentElementSizesInPx = { width: null, height: null };

        if (startIsRoot) { //если начинаем с корневого элемента
            currentElementSizesInPx.width = this.containerSizes.width;
            currentElementSizesInPx.height = this.containerSizes.width;
        } else {
            const { width, height } = this.document.defaultView.getComputedStyle(startElement); //получаем параметр  элемента
            currentElementSizesInPx.width = parseFloat(width);
            currentElementSizesInPx.height = parseFloat(height);

            selectors.forEach((selector) => {
                const elementRules = this.cssRules[selector];
                this.#rewriteElementCssRules(elementRules, currentElementSizesInPx, parentSizes);
            });
        }

        if (!startElement.children?.length) {
            return;
        }

        [...startElement.children].forEach((child) => {
            this.#convertPixelsToPercents(child, currentElementSizesInPx);
        })
    }

    #writeDOMContent(htmlContent) {
        // this.document.write(htmlContent);
        this.document = new JSDOM(htmlContent).window.document;
    }

    #writeStylesContent() {
        const styleSheets = Object.values(this.document.styleSheets)
        .map((e) => e.cssRules)
        .reduce((arr, v) => (arr.push(...v), arr), [])
        .map((e) => e.cssText);

        const {cssRules, cssAnimations} = CssParser.parseCSSToObj(styleSheets);
        this.cssRules = { ...cssRules };
        this.cssAnimations = { ...cssAnimations };
    }

    #replaceImagesWithSvg(imagesData) {
        const imgAttrubitesToFilter = ["id", "class", "data"]; //ToDo вынести

        imagesData.forEach(({name: imgName, value: imgValue}) => {
            const image = this.document.querySelector(`img[src$="${imgName}"]`);
            const imgAttributesStr = [...image.attributes]
                .map(({ name, value }) => ({ name, value }))
                .filter(
                    ({ name }) =>
                        imgAttrubitesToFilter.findIndex((imgAttr) =>
                            name.includes(imgAttr)
                        ) > -1
                )
                .reduce((str, { name, value }) => `${str} ${name}="${value}"`, "")
                .trim();
    
            // const imgValueParts =  imgValue.match(/\s(?!width|height)\S*/gmi) // парсим в массив, убирая атрибуты width и height
            // const imgValueToInsert = `<svg ${imgAttributesStr} ${imgValueParts.join('').trim()}`;
            const imgValueToInsert = imgValue.replace('<svg', `<svg ${imgAttributesStr}`);
            image.outerHTML = imgValueToInsert;
        });
    }

    #insertStylesIntoDocument() {
        const cssAnimations = this.cssAnimations;
        const cssRules = this.cssRules;
        const stylesStr = CssParser.parseObjToCss({cssAnimations, cssRules});
        [...this.document.body.querySelectorAll('style')].forEach((el) => el.remove());
        const stylesElement = this.document.createElement('style');
        stylesElement.innerHTML = stylesStr;
        this.document.body.prepend(stylesElement);
    }

    #setContainer() {
        const {width, height} = this.containerSizes;
        const aspectRatioCoef = `${(height / width * 100).toFixed(3)}%`;
        const root = this.document.body;
        const rootDataAttr = 'data-animation-root';
        const rootSelector = `[${rootDataAttr}]`;
        root.setAttribute(rootDataAttr, '');
        this.cssRules[rootSelector] =  {
            position: 'relative',
            width: `100%`,
            'padding-top': `${aspectRatioCoef}!important` 
        };
    }

    #getFormattedHtml() {
        let bodyHTML = this.document.body.outerHTML;
        bodyHTML = bodyHTML.replace('<body', '<div');
        bodyHTML = bodyHTML.replace('</body', '</div');
        return beautifier.html_beautify(bodyHTML);
    }

    parsePxToPercents(htmlString, imagesData) {
        this.#writeDOMContent(htmlString);
        this.#writeStylesContent();
        this.#initSelectorToElementConnections();
        this.#calcContainerSizes();

        this.#convertPixelsToPercents();
        this.#replaceImagesWithSvg(imagesData);
        this.#setContainer();
        this.#insertStylesIntoDocument();

        const formattedHtml = this.#getFormattedHtml();
        return formattedHtml;
    }
}

export default PixelConverter;
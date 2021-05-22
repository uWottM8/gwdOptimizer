import converterData from './PixelConverter.json';
import createHashFromString from '../JsHash/JsHash';

class PixelConverter {
    #defaultSettings = {
        ...converterData,
    }

    #settings = {};

    constructor({ styleSheets: { cssRules, cssAnimations }, document, settings = {} }) {
        this.#settings = { ...settings, ...this.#defaultSettings };
        this.cssRules = cssRules;
        this.cssAnimations = cssAnimations;
        this.document = document;
        this.#initSelectorToElementConnections();
        this.#calcContainerSizes();
        //this.#appendAnimationRootElement(); в последнюю очередь
        this.convertPixelsToPercents();
        //console.log('containerSizes are', this.containerSizes);
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

    // rewriteContainerSizeAttribute(selector, attributeName, mathFunc) {
    //     const selectorRules = this.cssRules[selector];
    //     if (!(attributeName in selectorRules)) {
    //         return;
    //     }

    //     const newValue = selectorRules[attributeName];
    //     if (!newValue.includes('px')) {
    //         return;
    //     }

    //     const parsedValue = parseFloat(newValue)
    //     const currentValue = this.containerSizes[attributeName];
    //     this.containerSizes[attributeName] = mathFunc(parsedValue, currentValue);
    // }

    //придумать другой алгоритм для вычисления максимальной ширины и высоты контейнера
    #calcContainerSizes(startElement = this.document.body) {
        if (!this.containerSizes) {
            this.containerSizes = { width: 0, height: 0 };
        }

        if (!startElement.children) {
            return;
        }

        const { selectors } = startElement;

        if (selectors) {
            selectors.forEach((selector) => {
                // console.log(this.document.querySelector(selector).tagName)
                // this.rewriteContainerSizeAttribute(selector, 'top', (newValue, currentValue) => Math.max(0, this.containerSizes.bottom, Math.min(newValue, currentValue)));
                // this.rewriteContainerSizeAttribute(selector, 'left', (newValue, currentValue) => Math.max(0, this.containerSizes.right, Math.min(newValue, currentValue)));
                // this.rewriteContainerSizeAttribute(selector, 'bottom', (newValue, currentValue) => Math.max(newValue, currentValue, this.containerSizes.top));
                // this.rewriteContainerSizeAttribute(selector, 'right', (newValue, currentValue) => Math.max(newValue, currentValue, this.containerSizes.left));
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

    #appendAnimationRootElement() {
        const rootClass = "animation-root";
        const rootClassExtended = `${rootClass}-${createHashFromString(rootClass)}`;
        const cssRules = {
            position: 'relative',
            width: `${this.containerSizes.width}px`,
            height: `${this.containerSizes.height}px`
        }
        const rootClassSelector = `.${rootClassExtended}`;
        this.cssRules[rootClassSelector] = cssRules;
        const rootElement = this.document.createElement('div');
        rootElement.classList.add(rootClassExtended);
        rootElement.innerHTML = this.document.body.innerHTML;
        this.document.body.innerHTML = rootElement.outerHTML;
        this.document.body.children[0].selectors = [rootClassSelector]; //добавление дополнительных свойст только через DOM!
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

    #convertCssAnimation(animationPropValue, parentSizes, currentElementSizesInPx) {
        console.log()
        console.log('cssAnimation');

        const animationName = animationPropValue.split(' ').find((str) => str in this.cssAnimations); //узнаем, что является именем анимации
        const animationObj = this.cssAnimations[animationName];
        for (const animationName in animationObj) {
            //вынести все, что ниже, в отдельный метод rewriteCssRulesForSelector
            const elementRules = animationObj[animationName];
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
                            this.#convertCssAnimation(cssValue, parentSizes, currentElementSizesInPx);
                        } else {
                            const convertedPropValue = this.#convertSingleCssRule(cssValue, baseSizes, dependencyInfo);
                            elementRules[cssProp] = convertedPropValue;
                        }
                }
            }
        }
    }

    #rewriteElementCssRules(elementRules) {
        
    }

    convertPixelsToPercents(startElement = this.document.body, parentSizes = null) {
        const { selectors } = startElement;
        if (!selectors) {
            console.log('no selectors');
            return;
        }

        const currentElementSizesInPx = { width: null, height: null };

        if (!parentSizes) { //если начинаем с корневого элемента
            const rootSelector = selectors[0];
            const { width, height } = this.cssRules[rootSelector];
            currentElementSizesInPx.width = this.containerSizes.width;
            currentElementSizesInPx.height = this.containerSizes.width;
        } else {
            const { width, height } = this.document.defaultView.getComputedStyle(startElement); //получаем параметр  элемента
            currentElementSizesInPx.width = parseFloat(width);
            currentElementSizesInPx.height = parseFloat(height);

            selectors.forEach((selector) => {
                //вынести все, что ниже, в отдельный метод rewriteCssRulesForSelector
                const elementRules = this.cssRules[selector];
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
                            this.#convertCssAnimation(cssValue, parentSizes, currentElementSizesInPx);
                        } else {
                            const convertedPropValue = this.#convertSingleCssRule(cssValue, baseSizes, dependencyInfo);
                            elementRules[cssProp] = convertedPropValue;
                        }
                    }
                }
            });
        }

        if (!startElement.children?.length) {
            return;
        }

        [...startElement.children].forEach((child) => {
            this.convertPixelsToPercents(child, currentElementSizesInPx);
        })
    }
}

export default PixelConverter;
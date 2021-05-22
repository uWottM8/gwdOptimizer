class CssParser {
    static parseCSSToObj(stylesSheet) {
        const stylesObject = { cssAnimations: {}, cssRules: {} };
        for (const rule of stylesSheet) {
            const openBracketPos = rule.indexOf('{');
            const selector = rule.slice(0, openBracketPos - 1);
    
            if (selector.startsWith('@-')) { //если свойство с префиксом, пропускаем
                continue;
            }
    
            const cssRules = rule.slice(openBracketPos + 1, rule.length - 1);
            if (selector.includes('keyframes')) {
                CssParser.#parseAnimationValues(selector, cssRules, stylesObject);
            } else {
                CssParser.#parseSelectorValues(selector, cssRules, stylesObject);
            }
        }
        return stylesObject;
    }

    static #parseSelectorValues(selector, cssRules, stylesObject) {
        if (!stylesObject.cssRules[selector]) {
            stylesObject.cssRules[selector] = {};
        }
        const propsAndValues = cssRules.split(';');
        propsAndValues.pop(); // убираем пустой элемент в конце после сплита
        stylesObject.cssRules[selector] = CssParser.#parseCssRules(propsAndValues);
    }

    static #parseAnimationValues(selector, cssRules, stylesObject) {
        const animName = selector.slice(selector.indexOf(' ') + 1);
        const keyframes = cssRules.split('\n').filter(e => e.trim());
        let animation = stylesObject.cssAnimations[animName] = {};
        keyframes.forEach(e => {
            const [timePoint, valuesStr] = e.split(' {');
            const values = valuesStr.split('; ');
            values.pop(); // удаляем лишнюю закрывающую скобку из конца
            animation[timePoint.trim()] = CssParser.#parseCssRules(values);
        });
    }
    
    static #parseCssRules(cssArray) {
        const cssObj = {};
        for (const str of cssArray) {
            const [prop, value] = str.split(':').map((el) => el.trim());
            if (prop.startsWith('-')) { //если свойство с префиксом, пропускаем
                continue;
            }
            cssObj[prop] = value;
        }
        return cssObj;
    }
    
}

export default CssParser;

// function parseCSSToObj(stylesSheet, /*DOMModel*/) {

//     const stylesObject = { cssAnimations: {}, cssRules: {} };
//     for (const rule of stylesSheet) {
//         const openBracketPos = rule.indexOf('{');
//         const selector = rule.slice(0, openBracketPos - 1);

//         if (selector.startsWith('@-')) { //если свойство с префиксом, пропускаем
//             continue;
//         }

//         const cssRules = rule.slice(openBracketPos + 1, rule.length - 1);
//         if (selector.includes('keyframes')) {
//             parseAnimationValues(selector, cssRules, stylesObject);
//         } else {
//             #parseSelectorValues(selector, cssRules, stylesObject, /*DOMModel*/);
//         }
//     }
//     return stylesObject;
//   }
  
// function #parseSelectorValues(selector, cssRules, stylesObject, /*DOMModel*/) {
//     // const elementInDoc = DOMModel.querySelector(selector)
//     // if (!selector.includes('.') && !selector.includes('[') || !elementInDoc) { // пропускаем селекторы-теги
//     //     return;
//     // }
//     if (!stylesObject.cssRules[selector]) {
//         stylesObject.cssRules[selector] = {};
//     }
//     const propsAndValues = cssRules.split(';');
//     propsAndValues.pop(); // убираем пустой элемент в конце после сплита
//     stylesObject.cssRules[selector] = parseCssRules(propsAndValues);

//     // if (!elementInDoc.selectorLinks) {  // связь элемент -> селектор
//     //     elementInDoc.selectorLinks = [];
//     // }
//     // elementInDoc.selectorLinks.push(selector);
// }

// function parseAnimationValues(selector, cssRules, stylesObject) {
//     const animName = selector.slice(selector.indexOf(' ') + 1);
//     const keyframes = cssRules.split('\n').filter(e => e.trim());
//     let animation = stylesObject.cssAnimations[animName] = [];
//     keyframes.forEach(e => {
//         const [timePoint, valuesStr] = e.split(' {');
//         const values = valuesStr.split('; ');
//         values.pop(); // удаляем лишнюю закрывающую скобку из конца
//         animation.push({[timePoint.trim()]: parseCssRules(values)});
//     });
// }

// function parseCssRules(cssArray) {
//     const cssObj = {};
//     for (const str of cssArray) {
//         if (str.startsWith('-')) {
//             continue;
//         }
//         const [prop, value] = str.split(':');
//         cssObj[prop.trim()] = value.trim();
//     }
//     return cssObj;
// }

// export default parseCSSToObj;


/*********************************Наработки для парсера с помощью regExp****************************************************/

// class CssParser {
//      /**
//      * [method description]
//      * Возвращает {} с полями: селектор, массив правил вида {}
//      */
//     #parseSignleSelectoRule(cssRuleStr) {
//         const selector = cssRuleStr.match(/(.*?)\s*\{/)[1];
//         const selectorRulesStr = cssRuleStr.match(/\{(.*?)\}/s)[1];
//         const rules = selectorRulesStr
//             .match(/[^(;\n)]*/gs)
//             .filter(str => str)
//             .map((singleCssRuleCss) => {
//                 const [prop, value] = singleCssRuleCss.split(':').map((str) => str.trim());
//                 return {
//                     prop,
//                     value
//                 }
//             });

//         return {
//             selector,
//             rules
//         };
//     }

//     /**
//      * [method description]
//      * Возвращает массив с селекторами из css-строки
//      */
//     #divideCssRuleStrBySelectors(cssString) {
//         return cssString
//                 .match(/.*?\}/gs)
//                 .map(str => str.trim());
//     }

//     parseFromString(cssString) {
//         return this.#divideCssRuleStrBySelectors(cssString)
//                 .map(this.#parseSignleSelectoRule);
//     }
// }

// export default CssParser;
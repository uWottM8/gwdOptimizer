class CssParser {
    static parseCSSToObj(stylesSheet) {
        const stylesObject = { cssAnimations: {}, cssRules: {} };
        for (const rule of stylesSheet) {
            const openBracketPos = rule.indexOf("{");
            const groupSelectors = rule.slice(0, openBracketPos - 1);

            const selectorsInGroup = groupSelectors
                .split(',')
                .map((selectorPart) => selectorPart.trim())
                .filter((selectorPart) => selectorPart);
            
            selectorsInGroup.forEach((selector) => {
                const selectorHasPrefix = selector.includes("@-");
                const selectorRelatesToSingleTag = /^\w+\s*$/.test(selector);
                if (selectorHasPrefix || selectorRelatesToSingleTag) {
                    console.log({['selector to skip']: selector})
                    return;
                }
    
                const cssRules = rule.slice(openBracketPos + 1, rule.length - 1);
                if (selector.includes("@keyframes")) {
                    CssParser.#parseAnimationValues(
                        selector,
                        cssRules,
                        stylesObject
                    );
                } else {
                    CssParser.#parseSelectorValues(
                        selector,
                        cssRules,
                        stylesObject
                    );
                }
            })
        }
        return stylesObject;
    }

    static #parseSelectorValues(selector, cssRules, stylesObject) {
        const selectorRulesObject = stylesObject.cssRules[selector] || {};
        const propsAndValues = cssRules.split(";").filter((pairPart) => pairPart);
        stylesObject.cssRules[selector] = {
            ...selectorRulesObject,
            ...CssParser.#parseCssRules(propsAndValues)
        };    
    }

    static #parseAnimationValues(selector, cssRules, stylesObject) {
        const animName = selector.slice(selector.indexOf(" ") + 1);
        const keyframes = cssRules.split("\n").filter((e) => e.trim());
        let animation = (stylesObject.cssAnimations[animName] = {});
        keyframes.forEach((e) => {
            const [timePoint, valuesStr] = e.split(" {");
            const values = valuesStr.split("; ");
            values.pop(); // удаляем лишнюю закрывающую скобку из конца
            animation[timePoint.trim()] = CssParser.#parseCssRules(values);
        });
    }

    static #parseCssRules(cssArray) {
        const cssObj = {};
        for (const str of cssArray) {
            const [prop, value] = str.split(":").map((el) => el.trim());
            if (prop.startsWith("-")) {
                //если свойство с префиксом, пропускаем
                continue;
            }
            cssObj[prop] = value;
        }
        return cssObj;
    }

    static #parseObjToString(obj, prefix) {
        let res = "";
        for (const cssProp in obj) {
            const cssValue = obj[cssProp];
            res +=
                (prefix ?? "") +
                cssProp +
                (typeof cssValue === "object"
                    ? ` {\n${CssParser.#parseObjToString(cssValue)}}\n`
                    : `: ${cssValue};\n`);
        }

        return res;
    }

    static parseObjToCss(cssObj) {
        const { cssRules, cssAnimations } = cssObj;
        return `${CssParser.#parseObjToString(
            cssRules
        )}\n${CssParser.#parseObjToString(cssAnimations, "@keyframes ")}`;
    }
}

export default CssParser;
import {JSDOM} from 'jsdom';
import CssParser from '../utils/CssParser/CssParser';
import PixelConverter from '../utils/PixelConverter/PixelConverter';

export default (req, res) => {
    const { body } = req;

    /* Ниже - запасной вариант вывода строки из тегов <style> */

    // const styleTagInner = body
    //                           .match(/<style.*?>(.*?)<\/style>/gs) // находим строки вида <style ...>...</style>
    //                           .map((styleTagStr) => styleTagStr.match(/<style.*?>(.*?)<\/style>/s)[1])//для каждой получаем внутреннее содержимое тегов
    //                           .join('\n');
    

    const jsdom = new JSDOM(body);
    const {window: {document}} = jsdom;
    const styleSheets = Object.values(document.styleSheets)
      .map(e => e.cssRules)
      .reduce((arr, v) => (arr.push(...v), arr), [])
      .map(e => e.cssText)
      //.join('\n');
    
    // const styleSheets = Object.values(document.styleSheets)
    //   .map(e => e.cssRules)
    //   .flat()
    //   .map(({style: cssStyleDeclaration, selectorText: selector}) => ({
    //         selector,
    //         cssProps: Array.from(cssStyleDeclaration) //список css-свойств
    //                     .reduce((styleObj, cssRuleName) => {
    //                         styleObj[cssRuleName] = cssStyleDeclaration[cssRuleName];
    //                         return styleObj;
    //                       }, {})
    //       }));            

    const stylesObject = CssParser.parseCSSToObj(styleSheets);

    new PixelConverter({
      styleSheets: stylesObject,
      document: document
    })

    //console.log(stylesObject.rules, stylesObject.animations);

    
    //получение атрибутов всех картинок кроме src
    //...document.querySelectorAll('img')].map((imgEl) => Array.from(imgEl.attributes).filter(({name}) => name !== 'src'))
    


    // const styleTagContent = /(?<=<style>)(.*)(?=\w*<\/style>)/s.exec(body)[0];//извлекаем все, что внутри тега style
    // console.log(styleTagContent);
    // const styleDeclaration = cssom.parse(styleTagContent);
    // const selectorToCssPropsObj = styleDeclaration
    //               .cssRules
    //               .map(({style: cssStyleDeclaration, selectorText: selector}) => ({
    //                 selector,
    //                 cssProps: Array.from(cssStyleDeclaration) //список css-свойств
    //                             .reduce((styleObj, cssRuleName) => {
    //                                 styleObj[cssRuleName] = cssStyleDeclaration[cssRuleName];
    //                                 return styleObj;
    //                               }, {})
    //               }));              
    
    res.statusCode = 200;
    res.json(stylesObject)
    //res.json(stylesObject);
    //res.json(selectorToCssPropsObj);
  }

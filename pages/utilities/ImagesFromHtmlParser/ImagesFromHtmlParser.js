class ImagesFromHtmlParser {
    static parseImages(htmlContent) {
        return htmlContent.match(/<img[^>]*>/gim);
    }

    static parseImgNamesFromHtml(htmlContent) {
        return ImagesFromHtmlParser.parseImages(htmlContent)
            .map((tag) =>
                tag
                    .match(/src\s*=\s*"([^"]+)/im)[1] // находим атрибут src
                    .split(/[\\\/]/)
                    .pop() // находим имя изображения
                    .trim()
            );
    }

    static parseSVG(htmlContent) {
        return htmlContent.match(/<svg.*?<\/svg>/gmis);
    }
}

export default ImagesFromHtmlParser;
function parseImgNamesFromHtml(htmlContent) {
    return htmlContent
        .match(/<img[^>]*>/gim) //находим теги-изображения
        .map((tag) =>
            tag
                .match(/src\s*=\s*"([^"]+)/im)[1] // находим атрибут src
                .split(/[\\\/]/)
                .pop() // находим имя изображения
                .trim()
        );
};

export default parseImgNamesFromHtml;
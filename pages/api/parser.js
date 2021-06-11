import fs from "fs";
import CssParser from "../utils/CssParser/CssParser";
import PixelConverter from "../utils/PixelConverter/PixelConverter";
import path from "path";

export default (req, res) => {
    const { body } = req;

    const contentType = req.headers["content-type"];
    if (contentType !== 'application/json') {
        res.statusCod = 500;
        res.send(`content type ${contentType} is not supported`);
    }
    
    const {html, images} = body;
    const converter = new PixelConverter();
    const data = converter.parsePxToPercents(html, images);
    res.statusCode = 200;
    res.send(data)
};
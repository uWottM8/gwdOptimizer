import path from 'path';
import fs from 'fs';

export default (req, res) => {
    const {body} = req;
    const {html, name} = JSON.parse(body);
    const pathToFile = path.resolve(__dirname, name);
    fs.writeFile(pathToFile, html, () => {
        res.download(pathToFile, () => {
            console.log('download');
        })
    });
}
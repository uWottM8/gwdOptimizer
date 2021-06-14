import formidable from 'formidable';
import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';

export const config = {
    api: {
      bodyParser: false,
    },
  }

export default async (req, res) => {
    const {body} = req;
    const form = new formidable.IncomingForm();
    const dirName = path.resolve(__dirname);
    form.uploadDir = dirName;
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        const {zip: { path: fullFileName } } = files;
        const zip = new AdmZip(fullFileName);
        const zipEntries = zip.getEntries();
        const htmlTestPattern = /\.html?/i;
        const svgTestPattern = /\.svg?/i;

        const zipContent = zipEntries.reduce((resObj, entry) => {
          if (!resObj.images) {
            resObj.images = [];
          }

          const {name: entyrName} =  entry;
          if (htmlTestPattern.test(entyrName)) {
            resObj.name = entyrName;
            resObj.html = entry.getData().toString('utf-8');
          } else if (svgTestPattern.test(entyrName)) {
            resObj.images.push({
              name: entyrName,
              value: entry.getData().toString('utf-8')
            });
          }

          return resObj;
        }, {});

        fs.unlinkSync(fullFileName);

        res.send(JSON.stringify(zipContent));
    });
}
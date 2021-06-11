import formidable from 'formidable';
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
    // const dirName = path.resolve(__dirname, '..', 'dist');
    // if (!fs.existsSync(dirName)) {
    //   fs.mkdirSync(dirName);
    // }
    // form.uploadDir = dirName;
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        const {zip} = files;
        console.log(zip.toString())
        //fs.readFileSync(path).
        res.end()
    });
}
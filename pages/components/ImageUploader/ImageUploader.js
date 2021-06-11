import { useState, useEffect } from "react";
import styles from './ImageUploader.module.css';

const ImageUploader = ({imagesNames, imageInsertHandler}) => {
    const [filesNamesToInsert, setFilesNamesToInsert] = useState([]);
    const [dataToUpload, setDataToUpload] = useState([]);

    useEffect(() => {
        setFilesNamesToInsert([...imagesNames]);
        setDataToUpload([]);
    }, [imagesNames])

    const uploadClickHandler = (event) => {
        const input = event.target;
        const uploadedFiles = [...input.files];
        input.value = null;

        const correctUploadedFileNames = uploadedFiles
                                            .map(({name}) => name)
                                            .filter((name) => filesNamesToInsert.includes(name));
        
        const remainedFileNames = filesNamesToInsert
                                    .filter((name) => !correctUploadedFileNames.includes(name));
       
        const generalDataToUpload = [
            ...dataToUpload, 
            ...uploadedFiles
                .filter(({name}) => correctUploadedFileNames.includes(name))
        ];

        setFilesNamesToInsert(remainedFileNames);

        if (remainedFileNames.length === 0) {
            imageInsertHandler(generalDataToUpload);
            return;
        }

        setDataToUpload(generalDataToUpload);
    }


    return (
        <div>
            Файлы для загрузки: 
            <ul>
            {
                filesNamesToInsert.map((name, i) => (
                    <li key={i}>{name}</li>
                ))
            }
            </ul>
            <input
                onChange={uploadClickHandler}
                type="file"
                accept=".svg"
                multiple={true}/>
        </div>
    )
};

export default ImageUploader;
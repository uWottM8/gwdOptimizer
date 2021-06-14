import { useState, useEffect } from "react";
import styles from "./ImageUploader.module.css";

const ImageUploader = ({ imagesNames, imagesUploadHandler }) => {
    const [filesNamesToInsert, setFilesNamesToInsert] = useState([]);
    const [dataToUpload, setDataToUpload] = useState([]);
    const [visibleNamesListState, setVisibleNamesListState] = useState(false);

    useEffect(() => {
        setFilesNamesToInsert([...imagesNames]);
        setDataToUpload([]);
        setVisibleNamesListState(false);
    }, [imagesNames]);

    const uploadClickHandler = (event) => {
        const input = event.target;
        const uploadedFiles = [...input.files];
        input.value = null;

        const correctUploadedFileNames = uploadedFiles
            .map(({ name }) => name)
            .filter((name) => filesNamesToInsert.includes(name));

        const remainedFileNames = filesNamesToInsert.filter(
            (name) => !correctUploadedFileNames.includes(name)
        );

        const generalDataToUpload = [
            ...dataToUpload,
            ...uploadedFiles.filter(({ name }) =>
                correctUploadedFileNames.includes(name)
            ),
        ];

        setFilesNamesToInsert(remainedFileNames);

        if (remainedFileNames.length === 0) {
            imagesUploadHandler(generalDataToUpload);
            return;
        }

        setDataToUpload(generalDataToUpload);
    };

    const toggleFullListShowEvent = (event) => {
        setVisibleNamesListState(!visibleNamesListState);
    }

    return (
        <div className={styles.imagesUploader}>
            <ul className={styles.imagesUploader__imagesList}>
                {filesNamesToInsert
                    .slice(0, visibleNamesListState ? Infinity : 5)
                    .map((name, i) => (
                    <li key={i} className={styles.imagesUploader__image}>
                        {name}
                    </li>
                ))}

                {
                   filesNamesToInsert.length > 5 && (
                       <div className={styles.imagesUploader__showFullListControl}>
                            <button
                                className={styles.imagesUploader__showFullListBtn} 
                                onClick={toggleFullListShowEvent}>
                                {
                                    visibleNamesListState
                                    ? 'Скрыть'
                                    : 'Показать полностью'
                                }  
                            </button>
                        </div>
                        
                    )
                }
            </ul>
            <button>
                Загрузить изображения
                <input
                    onChange={uploadClickHandler}
                    type="file"
                    accept=".svg"
                    multiple={true}
                />
            </button>
        </div>
    );
};

export default ImageUploader;

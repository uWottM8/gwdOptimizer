import { useState } from "react";
import styles from './ImageUploader.module.css';

const ImageUploader = ({imagesNames}) => {
    const [uploadedState, setUploadedState] = useState(false);

    return (
        <ul className={styles.imagesList}>
           {
                imagesNames.map((name,  i) => (
                    <li key={i} className={styles.imagesList__item}>
                        <div className={styles.imagesList__title}>{name}</div>
                        <button className={styles.imagesList__uploadBtn}>
                            Загрузить
                            <input 
                                type="file"
                                accept=".svg"/>
                        </button>
                    </li>
                ))
           }
        </ul>
    )
};

export default ImageUploader;
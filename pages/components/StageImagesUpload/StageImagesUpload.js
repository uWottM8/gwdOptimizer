import ImageUploader from "../ImageUploader/ImageUploader";
import styles from "./StageImagesUpload.module.css";

const StageImagesUpload = ({
        handlers: { imagesUploadHandler },
        content
    }) => {

    return (
        <div className={styles.stageImagesUpload}>
            <p className={styles.stageImagesUpload__title}>Файлы для загрузки:</p>
            <ImageUploader 
                imagesNames={content}
                imagesUploadHandler={imagesUploadHandler} />
        </div>

    );
};

export default StageImagesUpload;
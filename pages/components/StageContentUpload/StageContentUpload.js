import ContentUploader from "../ContentUploader/ContentUploader";
import ContentInserter from "../HtmlInserter/HtmlInserter";
import styles from "./StageContentUpload.module.css"

const StageHtmlUpload = ({
    handlers: {
        fileUploadHandler, fileInsertHandler
    }}) => {
        
    return (
        <div className={styles.stageUpload}>
            <div className={styles.stageUpload__item }>
                <p className={styles.stageUpload__title}>Загрузите архив с анимацией или файл в формате html</p>
                <ContentUploader
                    htmlUploadHandler={fileUploadHandler}
                />
            </div>
            <div className={styles.stageUpload__item }>
                <p className={styles.stageUpload__title}>Вставьте html-разметку анимации</p>
                <ContentInserter
                    fileInsertHandler={fileInsertHandler}
                />
            </div>
        </div>
    );
}

export default StageHtmlUpload;
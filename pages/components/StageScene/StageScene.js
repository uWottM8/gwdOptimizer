import stagesData from './StagesConfig.json';
import styles from './StageScene.module.css';
import Stage from '../Stage/Stage';
import ContentUploader from '../ContentUploader/ContentUploader';
import ContentInserter from '../ContentInserter/ContentInserter';
import ImageUploader from '../ImageUploader/ImageUploader';

const StagesList = ({activeStage, changeStageHandler, stagesHandlers, content}) => {
    const stages = [
        {
            ...stagesData[0],
            children:  [
                <ContentUploader fileUploadHandler={stagesHandlers[0].fileUploadHandler}/>,
                <ContentInserter fileInsertHandler={stagesHandlers[0].fileInsertHandler}/>
            ]
        },
        {
            ...stagesData[1],
            children:  [
                <ImageUploader imageInsertHandler={stagesHandlers[1].imageInsertHandler} imagesNames={content.images}/>
            ]
        },
        {
            ...stagesData[2],
            children:  [
                null
            ]
        },
        {
            ...stagesData[3],
            children:  [
                null
            ]
        },
    ];

    return (
       <div className={styles.stageScene}>
           <ul className={styles.stageScene__list}>
               {
                   stages.map((stageData) => (
                        <li key={stageData.storageKey} className={styles.stageScene__item}>
                            <Stage {...stageData}/>
                        </li>
                    ))
               }
           </ul>
       </div>
    );
};

export default StagesList;
import stagesData from './StagesConfig.json';
import styles from './StageScene.module.css';
import Stage from '../Stage/Stage';
import ContentUploader from '../ContentUploader/ContentUploader';
import ContentInserter from '../ContentInserter/ContentInserter';
import ImageUploader from '../ImageUploader/ImageUploader';
import ContentObserver from '../ContentObserver/ContentObserver';
import ZipUploader from '../ZipUploader/ZipUploader';

const StagesList = ({stagesHandlers, content, availableStagesCount}) => {
    const stages = [
       (<>
            <ContentUploader htmlUploadHandler={stagesHandlers[0].htmlUploadHandler}/>
            <ContentInserter fileInsertHandler={stagesHandlers[0].fileInsertHandler}/>
            <ZipUploader zipUploadHandler={stagesHandlers[0].zipUploadHandler}/>
       </>),
        (<ImageUploader 
            imageInsertHandler={stagesHandlers[1].imageInsertHandler} 
            imagesNames={content.images.map(({name}) => name)}
        />),
        (<ContentObserver {...content}/>)
    ];

    return (
       <div className={styles.stageScene}>
           <ul className={styles.stageScene__list}>
               {
                   stages
                    .slice(0, availableStagesCount)
                    .map((stageData, i) => (
                        <li key={stageData.storageKey} className={styles.stageScene__item}>
                            <Stage {...stagesData[i]}>
                            {
                                stages[i]    
                            }
                            </Stage>
                        </li>
                    ))
               }
           </ul>
       </div>
    );
};

export default StagesList;
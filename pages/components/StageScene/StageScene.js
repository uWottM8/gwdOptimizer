import {stagesContent, stagesStates} from "./StagesConfig.json";
import styles from "./StageScene.module.css";
import Stage from "../Stage/Stage";
import StageHtmlUpload from "../StageContentUpload/StageContentUpload";
import StageImagesUpload from "../StageImagesUpload/StageImagesUpload";
import ContentObserver from "../ContentObserver/ContentObserver";
import { useState, useEffect } from "react";

const StagesList = ({ stagesHandlers, content, availableStagesCount }) => {
    const [stagesActiveStates, setStagesActiveStates] = useState([true]);

    const stagesList = [
        {
            content: (
                <StageHtmlUpload 
                    handlers={stagesHandlers[0]}/>),
            isActive: availableStagesCount === 1
        },
        {
            content: (<StageImagesUpload 
                        handlers={stagesHandlers[1]}
                        content={content.images.map(({ name }) => name)}
                    />),
            isActive: availableStagesCount === 2
        },
        {
            content: (<ContentObserver {...content} />),
            isActive: availableStagesCount === 3
        }

    ].slice(0, availableStagesCount)

    return (
        <div className={styles.stageScene}>
            <ul className={styles.stageScene__list}>
                {
                    stagesList
                        .map(({content, isActive}, i) => (
                            <li
                                key={stagesContent[i].storageKey}
                                className={styles.stageScene__item}
                            >
                                <Stage 
                                    {...stagesContent[i]}
                                    isActive={isActive}
                                >
                                    {content}
                                </Stage>
                            </li>
                        ))
                }
            </ul>
        </div>
    );
};

export default StagesList;

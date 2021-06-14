import { useState } from 'react';
import styles from './Stage.module.css';

const Stage = ({title, subtitle, storageKey, children, isActive}) => {
    const [isStageActive, toggleStage] = useState(isActive);
    const toggleStageBtnHandler = (event) => {
        toggleStage(!isStageActive)
    }

    return (
        <div className={styles.stage}>
            <h2 className={styles.stage__title}>
                Шаг {storageKey}
                <br/>{title}
            </h2>
            <div className={`${styles.stage__content} ${isStageActive ? styles.stage__content_active : ''}`}>
                {
                    subtitle && (
                        <h3 className={styles.stage__description}>{subtitle}</h3>
                    )
                }
                <div className={styles.stage__handler}>
                   {children}
                </div>
            </div>
            <button 
                className={`${styles.stage__btnToggle} ${isStageActive ? styles.stage__btnToggle_active : ''}`} 
                onClick={toggleStageBtnHandler}>
                    {">"}
            </button>
        </div>
    );
};

export default Stage;
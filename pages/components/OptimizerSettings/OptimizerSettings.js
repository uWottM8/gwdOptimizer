import styles from './OptimizerSettings.module.css';

const OptimizerSettings = ({hidden}) => {

    return (
        <div className={styles.optimizerSettings}>
            <ul className={`${styles.optimizerSettings__list} ${hidden ? '' : styles.optimizerSettings__list_active}`}>
                <li className={styles.optimizerSettings__item}>Первая опция</li>
                <li className={styles.optimizerSettings__item}>Вторая опция</li>
            </ul>
        </div>
    );
};

export default OptimizerSettings;
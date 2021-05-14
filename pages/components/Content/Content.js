import styles from './Content.module.css';

const Content = ({blurState}) => {
    return (
        <div className={`${styles.content}${blurState ? " " + styles.content_blured : ""}`}>
            <h1>Test</h1>
        </div>
    ); 
}

export default Content;
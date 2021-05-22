import {useRef, useEffect} from 'react';
import styles from './Content.module.css';

const Content = ({htmlContent}) => {
    const contentBlockRef = useRef(null);
    useEffect(() => {
        const block = contentBlockRef.current;
        block.innerHTML = htmlContent;
    }, [htmlContent]);

    return (
        <div 
            ref={contentBlockRef} 
            className={styles.content}>
        </div>
    ); 
}

export default Content;
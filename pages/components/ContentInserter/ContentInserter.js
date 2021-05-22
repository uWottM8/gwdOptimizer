import {useState} from 'react';

const ContentInserter = ({fileInsertHandler}) => {
    const [inputAvailable, setInputAvailable] = useState(false);

    const toggleInputAvailabity = () => {
        setInputAvailable(!inputAvailable);
    };

    const insertBtnClickHandler = (event) => {
        toggleInputAvailabity();
    };

    const insertInputBlurHandler = (event) => {
        const input = event.target;
        const value = input.value.trim();
        if (value !== '') {
            fileInsertHandler(value)
        }
        toggleInputAvailabity();
    }

    return inputAvailable
        ? (
            <input
                type="text" 
                autoFocus
                onBlur={insertInputBlurHandler}/>
        ) : (
            <button onClick={insertBtnClickHandler}>
                Вставить html
            </button>
        );
}

export default ContentInserter;
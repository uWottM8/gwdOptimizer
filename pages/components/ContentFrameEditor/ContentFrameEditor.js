import { useState } from "react";

const ContentFrameEditor = ({frameChangeHangler, observerVisibilityHandler}) => {
    const [editState, setEditState] = useState(false);
    const [proportionalChange, setProportionalChange] = useState(false)

    const toggleEditEvent = (event) => {
        setEditState(!editState);
        observerVisibilityHandler();
    }

    const toggleProportionalChange = (event) => {
        setProportionalChange(!proportionalChange);
    }

    const borderEditEvent = (event, propName) => {
        const input = event.target;
        const numericValue = input.value.replace(/\D/, '');
        input.value = numericValue;
        const frameProp = {
            [propName]: `${numericValue || 0}px`
        }
        frameChangeHangler(frameProp);
    }

    return (
        <div>
            {
                editState
                ? (
                    <>
                        <span>
                            <label for="paddingLeft">Левый отсуп</label>
                            <input
                                id="paddingLeft"
                                type="text" 
                                placeholder="Слева"
                                onChange={(event) => borderEditEvent(event, 'paddingLeft')}/>

                        </span>
                        <span>
                            <label for="paddingRight">Правый отсуп</label>
                            <input
                                id="paddingRight"
                                type="text"
                                placeholder="Справа"
                                onChange={(event) => borderEditEvent(event, 'paddingRight')}/>
                        </span>
                        <span>
                            <button onClick={toggleProportionalChange}>
                                {
                                    proportionalChange
                                        ? ('[]-[]')
                                        : ('[] []')
                                }
                            </button>
                        </span>
                        <button onClick={toggleEditEvent}>X</button>
                    </>
                ): (<button onClick={toggleEditEvent}>Редактировать отсутпы</button>)
            }
        </div>
    )
}

export default ContentFrameEditor;
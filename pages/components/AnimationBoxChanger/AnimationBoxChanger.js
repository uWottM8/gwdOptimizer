import { useState } from "react";
import styles from "./AnimationBoxChanger.module.css";

const AnimationBoxChanger = ({ children }) => {
    const [contentWidth, setContentwidth] = useState(400);
    const [widthEditorState, setWidthEditorState] = useState({
        isActive: false,
    });

    const [contentPadding, setContentPadding] = useState({
        paddingLeft: 0,
        paddingRight: 0,
    });
    const [paddingEditorState, setPaddingEditorState] = useState({
        isActive: false,
        isProportional: false,
    });

    //Паддинг
    const changePadding = (numericValue, dir) => {
        const valueToSet = Math.max(numericValue, 0);
        const { isProportional } = paddingEditorState;
        const updatedcontentPadding = isProportional
            ? {
                  ...contentPadding,
                  paddingRight: valueToSet,
                  paddingLeft: valueToSet,
              }
            : { ...contentPadding, [`padding${dir}`]: valueToSet };
        setContentPadding(updatedcontentPadding);
    };

    const changePaddingOnInput = (input, dir) => {
        const numericValue = input.value.replace(/^0+\D?/, "") || 0;
        changePadding(numericValue, dir);
    };

    const hidePaddingEditorEvent = (event) => {
        setPaddingEditorState({ isActive: false });
    };

    const showPaddingEditorEvent = (event) => {
        setPaddingEditorState({ isActive: true });
    };

    const toggleProportionaPaddingEditorEvent = (event) => {
        const { isProportional } = paddingEditorState;
        if (!isProportional) {
            const { paddingLeft, paddingRight } = contentPadding;
            const minValue = Math.min(paddingLeft, paddingRight);
            setContentPadding({
                ...contentPadding,
                paddingRight: minValue,
                paddingLeft: minValue,
            });
        }

        setPaddingEditorState({
            ...paddingEditorState,
            isProportional: !isProportional,
        });
    };

    const triggerPaddingEditorOnMouseEvent = (event) => {
        const mouseStartPos = event.clientX;
        setPaddingEditorState({
            ...paddingEditorState,
            isMouseActive: true,
            mouseStartPos,
        });
    };

    const shutDownPaddingEditorOnMouseEvent = (event) => {
        const { isMouseActive } = paddingEditorState;
        if (!isMouseActive) {
            return;
        }

        setPaddingEditorState({
            ...paddingEditorState,
            isMouseActive: false,
        });
    };

    const paddingEditOnMouseEvent = (event, dir) => {
        const { isMouseActive, mouseStartPos } = paddingEditorState;
        if (!isMouseActive) {
            return;
        }
        const mouseEndPos = event.clientX;
        const paddingValue = contentPadding[`padding${dir}`];
        let dx = (mouseEndPos - mouseStartPos) * (dir === "Right" ? -1 : 1);
        setPaddingEditorState({
            ...paddingEditorState,
            mouseStartPos: mouseEndPos,
        });
        changePadding(paddingValue + dx, dir);
    };

    //Ширина
    const triggerWidthEditorEvent = (event) => {
        const mouseStartPos = event.clientX;
        setWidthEditorState({
            ...widthEditorState,
            isActive: true,
            mouseStartPos,
        });
    };

    const shutDownWidthEditorEvent = (event) => {
        const { isActive } = widthEditorState;
        if (!isActive) {
            return;
        }
        setWidthEditorState({ isActive: false });
    };

    const widthEditEvent = (event) => {
        const { mouseStartPos, isActive } = widthEditorState;
        if (!isActive) {
            return;
        }
        const mouseEndPos = event.clientX;
        setContentwidth(contentWidth + 2 * (mouseEndPos - mouseStartPos));
        setWidthEditorState({
            ...widthEditorState,
            mouseStartPos: mouseEndPos,
        });
    };

    return (
        <>
            {/*Панель для редактирования паддинга*/}
            <div className={styles.boxPanel}>
                {paddingEditorState.isActive ? (
                    <div className={styles.boxPanel__elements}>
                        <div className={styles.boxPanel__control}>
                            <label 
                                htmlFor="Left"
                                className={styles.boxPanel__label}
                            >
                                Слева
                            </label>
                            <input
                                id="Left"
                                type="text"
                                value={contentPadding.paddingLeft}
                                onChange={(event) =>
                                    changePaddingOnInput(event.target, "Left")
                                }
                            />
                        </div>
                        <div className={styles.boxPanel__control}>
                            <label
                                className={styles.boxPanel__label} 
                                htmlFor="Right"
                            >
                                Справа
                            </label>
                            <input
                                id="Right"
                                type="text"
                                value={contentPadding.paddingRight}
                                onChange={(event) =>
                                    changePaddingOnInput(event.target, "Right")
                                }
                            />
                        </div>

                        <div className={styles.boxPanel__control}>
                            <label 
                                htmlFor="proportion"
                                className={styles.boxPanel__label} 
                            >
                                    Пропорции
                            </label>
                            <input
                                type="checkbox"
                                id="proportion"
                                value={paddingEditorState.isProportional}
                                onChange={toggleProportionaPaddingEditorEvent}
                            />
                        </div>
                        <div className={styles.boxPanel__control}>
                            <button onClick={hidePaddingEditorEvent}>
                                &times;
                            </button>
                        </div>
                    </div>
                ) : (
                    <button onClick={showPaddingEditorEvent}>
                        Редактировать отступы
                    </button>
                )}
            </div>

            {/*Контентная область*/}
            <div className={styles.boxChanger}>
                <div
                    className={styles.boxChanger__marginBox}
                    style={{ width: `${contentWidth}px` }}
                >
                    <div
                        className={styles.boxChanger__paddingBox}
                        style={{
                            paddingLeft: `${contentPadding.paddingLeft}px`,
                            paddingRight: `${contentPadding.paddingRight}px`,
                        }}
                    >
                        {paddingEditorState.isActive && (
                            <div
                                style={{
                                    left: `${contentPadding.paddingLeft}px`,
                                }}
                                className={`${styles.boxChanger__paddingToggle} ${styles.boxChanger__paddingToggle_left}`}
                                onMouseDown={triggerPaddingEditorOnMouseEvent}
                                onMouseUp={shutDownPaddingEditorOnMouseEvent}
                                onMouseLeave={shutDownPaddingEditorOnMouseEvent}
                                onMouseMove={(event) =>
                                    paddingEditOnMouseEvent(event, "Left")
                                }
                            />
                        )}

                        <div className={styles.boxChanger__content}>
                            {children}
                        </div>

                        {paddingEditorState.isActive && (
                            <div
                                style={{
                                    right: `${contentPadding.paddingRight}px`,
                                }}
                                className={`${styles.boxChanger__paddingToggle} ${styles.boxChanger__paddingToggle_right}`}
                                onMouseDown={triggerPaddingEditorOnMouseEvent}
                                onMouseUp={shutDownPaddingEditorOnMouseEvent}
                                onMouseLeave={shutDownPaddingEditorOnMouseEvent}
                                onMouseMove={(event) =>
                                    paddingEditOnMouseEvent(event, "Right")
                                }
                            />
                        )}
                    </div>
                    {!paddingEditorState.isActive && (
                        <div
                            className={styles.boxChanger__marginStripe}
                            onMouseDown={triggerWidthEditorEvent}
                            onMouseUp={shutDownWidthEditorEvent}
                            onMouseLeave={shutDownWidthEditorEvent}
                            onMouseMove={widthEditEvent}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default AnimationBoxChanger;

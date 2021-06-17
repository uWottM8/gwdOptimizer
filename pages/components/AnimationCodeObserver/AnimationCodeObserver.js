import { useState } from "react";
import ContentMinifier from "../ContentMinifier/ContentMinifier";
import Editor from "@monaco-editor/react";
import styles from "./AnimationCodeObserver.module.css";

const AnimationCodeObserver = ({
    copyHtmlToClipboardEvent,
    copyState,
    html,
    localHtml,
    minifyHandler,
    handleEditorDidMount,
    downloadEvent,
}) => {
    const [codeViewerVisibility, setCodeViewerVisibility] = useState(false);

    const codeViewerToggleHandler = (event) => {
        setCodeViewerVisibility(!codeViewerVisibility);
    };

    return (
        <div className={styles.codeViewer}>
            <button
                className={styles.codeViewer__toggleBtn}
                onClick={codeViewerToggleHandler}
            >
                {codeViewerVisibility ? "Скрыть" : "Показать HTML"}
            </button>
            {codeViewerVisibility && (
                <div>
                    <button onClick={copyHtmlToClipboardEvent}>
                        {copyState ? (
                            <>&#10004;</>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-clipboard"
                                viewBox="0 0 16 16"
                            >
                                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                            </svg>
                        )}
                    </button>
                    <button onClick={downloadEvent}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                        </svg>
                    </button>
                    {/*Загрузка файла*/}
                    <ContentMinifier
                        primaryHtml={html}
                        localHtml={localHtml}
                        minifyHandler={minifyHandler}
                    />
                    <Editor
                        height="400px"
                        defaultLanguage="html"
                        defaultValue={html}
                        onMount={handleEditorDidMount}
                        options={{
                            readOnly: true,
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default AnimationCodeObserver;

import { useState, useRef, useEffect } from "react";
import AnimationBoxChanger from "../AnimationBoxChanger/AnimationBoxChanger";
import AnimationPlayer from "../AnimationPlayer/AnimationPlayer";
import AnimationCodeObserver from "../AnimationCodeObserver/AnimationCodeObserver";
import styles from "./Content.module.css";

const ContentObserver = ({ html, name }) => {
    const [localHtml, setLocalHtml] = useState(html);

    const [htmlVisibility, setHtmlVisibility] = useState(false);

    const [monacoEditorModel, setMonacoEditorModel] = useState(null);

    const [animationPlayState, setAnimationPlayState] = useState("running");

    const [copyState, setCopyState] = useState(false);
    const [wrapperStyle, setWrapperStyle] = useState({});

    const editorRef = useRef(null);

    const animationCssStates = {
        running: "", //нет модификатора
        stopped: styles.contentObserver__animationStopped,
        removed: styles.contentObserver__animationRemoved,
    };

    const observerRef = useRef(null);
    useEffect(() => {
        const observerElement = observerRef.current;
        observerElement.innerHTML = html;
    }, [html]);

    const minifyHandler = (newHtml) => {
        setLocalHtml(newHtml);
        monacoEditorModel.editor.getModels()[0].setValue(newHtml);
        observerRef.current.innerHTML = newHtml;
    };

    //управление воспроизведением анимации

    const restartAnimationEvent = (event) => {
        setAnimationPlayState("removed");
        setTimeout(() => {
            setAnimationPlayState("running");
        }, 0);
    };

    const toggleAnimationPlayEvent = () => {
        animationPlayState === "running"
            ? setAnimationPlayState("stopped")
            : setAnimationPlayState("running");
    };

    //управление показом кода
    const toggleHtmlViewerEvent = (event) => {
        setHtmlVisibility(!htmlVisibility);
    };

    const handleEditorDidMount = (editor, monaco) => {
        setMonacoEditorModel(monaco);
    };

    const copyHtmlToClipboardEvent = () => {
        if (copyState) {
            return;
        }

        navigator.clipboard.writeText(html).then(() => {
            const copyTimer = setTimeout(() => setCopyState(false), 1000);
            setCopyState(copyTimer);
        });
    };

    //FPS
    const measureFPS = () => {
        let prevTime = Date.now();
        let frames = 0;

        requestAnimationFrame(function loop() {
            if (!htmlVisibility) {
                return;
            }

            const time = Date.now();
            frames++;
            if (time > prevTime + 1000) {
                let fps = Math.round((frames * 1000) / (time - prevTime));
                prevTime = time;
                frames = 0;

                console.info("FPS: ", fps);
            }

            requestAnimationFrame(loop);
        });
    };

    const changeContentFrame = (frameProps) => {
        setWrapperStyle({ ...wrapperStyle, ...frameProps });
    };

    const downloadEvent = (event) => {
        const link = document.createElement("a");
        link.setAttribute(
            "href",
            `data:text/html;charset=utf-8,${encodeURIComponent(localHtml)}`
        );
        link.setAttribute("download", name);
        link.setAttribute("hidden", "");
        document.body.append(link);
        link.click();
        link.remove();
    };

    return (
        <>
            <AnimationBoxChanger>
                <AnimationPlayer
                    restartAnimationEvent={restartAnimationEvent}
                    toggleAnimationPlayEvent={toggleAnimationPlayEvent}
                    animationPlayState={animationPlayState}
                />
                <div
                    ref={observerRef}
                    className={`${styles.contentObserver} ${animationCssStates[animationPlayState]}`}
                    style={wrapperStyle}
                />
            </AnimationBoxChanger>

            <AnimationCodeObserver 
                 copyHtmlToClipboardEvent={copyHtmlToClipboardEvent}
                 copyState={copyState}
                 html={html}
                 localHtml={localHtml}
                 minifyHandler={minifyHandler}
                 handleEditorDidMount={handleEditorDidMount}
                 downloadEvent={downloadEvent}
            />
        </>
    );
};

export default ContentObserver;

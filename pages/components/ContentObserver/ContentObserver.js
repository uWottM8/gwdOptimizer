import {useState, useRef, useEffect} from 'react';
import Editor from "@monaco-editor/react";
import ContentFrameEditor from '../ContentFrameEditor/ContentFrameEditor'; //переместить в boxChanger
import AnimationBoxChanger from '../AnimationBoxChanger/AnimationBoxChanger';
import styles from './Content.module.css';

const ContentObserver = ({html, name}) => {
    const [sliderXPos, setSliderXPos] = useState(null);
    const [observerWidth, setObserverWidth] = useState(400);
    const [observerWidthChangeMode, setObserverWidthChangeMode] = useState(true);

    const [htmlVisibility, setHtmlVisibility] = useState(false);

    const [animationPlayState, setAnimationPlayState] = useState('running')

    const [copyState, setCopyState] = useState(false);
    const [wrapperStyle, setWrapperStyle] = useState({});

    const editorRef = useRef(null);

    const animationCssStates = {
        'running': '', //нет модификатора
        'stopped': styles.contentObserver__animationStopped,
        'removed': styles.contentObserver__animationRemoved
    }

    const observerRef = useRef(null);
    useEffect(() => {
        const observerElement = observerRef.current;
        observerElement.innerHTML = html;
    }, [html]);


    //управление размером контента

    const dragMouseAreaEvent = (event) => {
        setSliderXPos(event.clientX);
    }

    const dropMouseAreaEvent = (event) => {
        setSliderXPos(null);
    }

    const changeContentWidthEvent = (event) => {
        if (sliderXPos === null) {
            return
        }

        const currentCursorXPos = event.clientX;
        const shift = 2 * (currentCursorXPos - sliderXPos); // умножаем на 2, чтобы плажка успевала за курсором
        setObserverWidth(observerWidth + shift);
        setSliderXPos(currentCursorXPos);
    }

    const observerMouseLiveEvent = (event) => {
        if (sliderXPos !== null) {
            setSliderXPos(null);
        }
    }

     //управление воспроизведением анимации

    const restartAnimationEvent = (event) => {
        setAnimationPlayState('removed');
        setTimeout(() => {
            setAnimationPlayState('running');
        }, 0);
        
    }

    const toggleAnimationPlayEvent = () => {
        animationPlayState === 'running'
            ? setAnimationPlayState('stopped')
            : setAnimationPlayState('running');
    }

    //управление показом кода
    const toggleHtmlViewerEvent = (event) => {
        setHtmlVisibility(!htmlVisibility);
    }

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor
    }

    const copyHtmlToClipboardEvent = () => {
        if (copyState) {
            return;
        }

        navigator.clipboard.writeText(html)
            .then(() => {
                const copyTimer = setTimeout(() => setCopyState(false), 1000);
                setCopyState(copyTimer);
            });
    }

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
                let fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) );
                prevTime = time;
                frames = 0;

                console.info('FPS: ', fps);
            }

            requestAnimationFrame(loop);
        });
    }

    const changeContentFrame = (frameProps) => {
        setWrapperStyle({...wrapperStyle, ...frameProps});
    }

    const toggleContentObserver = () => {
        setObserverWidthChangeMode(!observerWidthChangeMode);
    }

    const downloadEvent = (event) => {
        const link = document.createElement('a');
        link.setAttribute('href', `data:text/html;charset=utf-8,${encodeURIComponent(html)}`)
        link.setAttribute('download', name);
        link.setAttribute('hidden', '');
        document.body.append(link)
        link.click();
        link.remove();
    }

    return (
        <div>
            {/*Проигрыватель*/}
            <div>
                <button onClick={restartAnimationEvent}>&#8635;</button>
                <button onClick={toggleAnimationPlayEvent}>{ animationPlayState === 'running' ? 'stop' : 'play' }</button>
            </div>
            {/*Редактирование обертки*/}

            <AnimationBoxChanger>
                <div 
                    ref={observerRef}
                    className={`${styles.contentObserver} ${animationCssStates[animationPlayState]}`} 
                    style={wrapperStyle}/>
            </AnimationBoxChanger>

            {/*Просмотр кода*/}
            <div style={{zIndex: 10, position: 'relative'}}>
                <button onClick={toggleHtmlViewerEvent}>
                    {
                        htmlVisibility
                            ? "Скрыть"
                            : "Показать HTML"
                    }
                </button>
                {
                    htmlVisibility && (
                        <>
                            <button onClick={copyHtmlToClipboardEvent}>
                                {
                                    copyState ? (
                                        <>&#10004;</>) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard" viewBox="0 0 16 16">
                                            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                                            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                                        </svg>)
                                }
                               
                            </button>
                             {/*Загрузка файла*/}
                            <button onClick={downloadEvent}>Загрузить</button>
                            <Editor
                                height="400px"
                                defaultLanguage="html"
                                defaultValue={html}
                                onMount={handleEditorDidMount}
                                options={{
                                    readOnly: true
                                }}/>
                        </>)
                }
            </div>
        </div>
    ); 
}

export default ContentObserver;
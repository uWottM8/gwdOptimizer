import { useState, useEffect } from "react";
import Hash from "./utilities/Hash/Hash";
import Head from "next/head";
// import Menu from './components/Menu/Menu';
// import Content from './components/Content/Content';
// import OptimizerSettings from './components/OptimizerSettings/OptimizerSettings';
import StagesList from "./components/StageScene/StageScene";
import styles from "../styles/Home.module.css";

import ImagesFromHtmlParser from './utilities/ImagesFromHtmlParser/ImagesFromHtmlParser';

//почему не получается импортировать ?
// import * as zip from "@zip.js/zip.js";

const Home = () => {
    const [activeStage, setActiveStage] = useState(1);

    // const [menuHiddenState, setMenuHiddenState] = useState(false);
    const [content, setContent] = useState({
        name: null,
        html: null,
        images: [],
    });

    const fileUploadHandler = (file) => {
        const {type} = file;
        if (type === 'application/x-zip-compressed') {
            zipUploadHandler(file);
        } else if (type === 'text/html') {
            htmlUploadHandler(file);
        } else {
            throw new Error('неподдерживаемый формат файла');
        }
    }

    const htmlUploadHandler = async (htmlFile) => {
        const {name: primaryFileName} = htmlFile;
        const html = await htmlFile.text();
        switchToImagesUploadStage(primaryFileName, html);
    };

    const fileInsertHandler = (html) => {
        switchToImagesUploadStage('index.html', html);
    };

    const switchToImagesUploadStage = (primaryFileName, html) => {
        const secondaryFileName = Hash.createHashFileName(primaryFileName);
        const imgNames = ImagesFromHtmlParser.parseImgNamesFromHtml(html);
        const images = imgNames.map((name) => ({name, value: null}));
        setContent({ html, images, name: secondaryFileName });
        setActiveStage(2);
    }

    const zipUploadHandler = async (zipFile) => {
        const formData = new FormData();
        formData.append('zip', zipFile);
        const fetchRes = await fetch('/api/zipParser', {
            method: 'POST',
            body: formData
        });
        if (!fetchRes.ok) {
            throw new Error('erron in zip parse')
        }
        const {images, name, html} = await fetchRes.json();
        console.log({name});
        const requiredImages = ImagesFromHtmlParser.parseImgNamesFromHtml(html);
        const correctRecievedImages = images.filter((image) => requiredImages.includes(image.name));
        if (correctRecievedImages.length === requiredImages.length) {
            setContent({html, name, images: correctRecievedImages});
            convertAnimation(html, correctRecievedImages, name);
        }
    };

    const imagesUploadHandler = async (files) => {
        const images = await Promise.all(files.map(async (file) => {
            const { name } = file;
            const value = await file.text();
            return {
                name,
                value,
            };
        }))

        convertAnimation(content.html, images, content.name);
    };

    const convertAnimation = async (html, images, name) => {
        const fetchRes = await fetch("/api/htmlParser", {
            method: "POST",
            body: JSON.stringify({
                html,
                images
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!fetchRes.ok) {
            return;
        }

        const convertedHtml = await fetchRes.text();
        setContent({ name, html: convertedHtml, images: [] });
        setActiveStage(3);
    }
    

    const stagesHandlers = [
        {
            fileInsertHandler,
            fileUploadHandler,
        },
        {
            imagesUploadHandler,
        },
    ];

    return (
        <>
            <Head>
                <title>Animation optimizer</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header className={styles.header}>
                <div className={styles.header__inner}>
                    <span className={styles.header__logo}>Animation Optimizer</span>
                    <span></span>
                </div>
            </header>

            <main>
                <StagesList
                    stagesHandlers={stagesHandlers}
                    availableStagesCount={activeStage}
                    content={content}
                />
            </main>

            <footer className={styles.footer}></footer>
        </>
    );
};

export default Home;
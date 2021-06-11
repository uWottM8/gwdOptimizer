import { useState, useEffect } from "react";
import Hash from "./utils/Hash/Hash";
import Head from "next/head";
// import Menu from './components/Menu/Menu';
// import Content from './components/Content/Content';
// import OptimizerSettings from './components/OptimizerSettings/OptimizerSettings';
import StagesList from "./components/StageScene/StageScene";
import styles from "../styles/Home.module.css";

import parseImgNamesFromHtml from './utils/ImagesFromHtml/ImagesFromHtml';

//почему не получается импортировать ?
// import {ZipReader, BlobReader, TextWriter} from "@zip.js/zip.js";

const Home = () => {
    const [activeStage, setActiveStage] = useState(1);

    // const [menuHiddenState, setMenuHiddenState] = useState(false);
    const [content, setContent] = useState({
        name: null,
        html: null,
        images: [],
    });

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
        const imgNames = parseImgNamesFromHtml(html);
        const images = imgNames.map((name) => ({name, value: null}));
        setContent({ html, images, name: secondaryFileName });
        setActiveStage(2);
    }

    const zipUploadHandler = async (zipFile) => {
        const reader = new ZipReader(new BlobReader(zipFile));
        const entries = await reader.getEntries()
        const fileNamePattern = /[^\.\\\/]+\.\w+$/i;
        const files = await Promise.all(entries
            .filter(({filename}) => filename.match(fileNamePattern))
            .map(async (entry) => {
                const {filename} = entry;
                    const shortFileName = filename.match(fileNamePattern)[0];
                    const value = await entry.getData(new TextWriter());
                    return {
                        name: shortFileName,
                        value 
                    }
        }));
        const {value: html} = files.find(({name}) => name.includes('.html'));
        const images = files.filter(({value}) => value !== htmlValue);
        setContent({...content, html});
        convertAnimation(images)
    };

    const imageInsertHandler = async (files) => {
        const images = await Promise.all(files.map(async (file) => {
            const { name } = file;
            const value = await file.text();
            return {
                name,
                value,
            };
        }))

        convertAnimation(images);
    };

    const convertAnimation = async (images) => {
        const fetchRes = await fetch("/api/parser", {
            method: "POST",
            body: JSON.stringify({
                html: content.html,
                images
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!fetchRes.ok) {
            return;
        }

        const html = await fetchRes.text();
        setContent({ ...content, html, images: [] });
        setActiveStage(3);
    }
    

    const stagesHandlers = [
        {
            fileInsertHandler,
            htmlUploadHandler,
            imageInsertHandler,
            zipUploadHandler,
        },
        {
            imageInsertHandler,
        },
    ];

    return (
        <>
            <Head>
                <title>Animation optimizer</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

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
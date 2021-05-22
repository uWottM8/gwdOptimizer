import { useState, useEffect } from "react";
import Head from 'next/head';
// import Menu from './components/Menu/Menu';
// import Content from './components/Content/Content';
// import OptimizerSettings from './components/OptimizerSettings/OptimizerSettings';
import StagesList from './components/StageScene/StageScene';
import styles from '../styles/Home.module.css';


const Home = () => {
  const [activeStage, setActiveStage] = useState(1);
  const changeStageHandler = (stage) => {
    setActiveStage(stage);
  }

  // const [menuHiddenState, setMenuHiddenState] = useState(false);
  const [content, setHtmlContent] = useState({ html: null, images: ['test', 'afasfa asfasf'] });

  const fileUploadHandler = (file) => {
    console.log('fileUploadHandler', file);
    fetch('/api/parser', {
      method: "POST",
      body: file
    }).then((res) => res.json())
      .then((value) => console.log(value))
  }

  const fileInsertHandler = (htmlValue) => {
    setHtmlContent({...content, html: htmlValue});
    console.log('inserted')
  }

  const imageInsertHandler = (imgValue) => {
    setHtmlContent({...content, images: [...content.images, imgValue]});
  }

  const stagesHandlers = [
    {
      fileInsertHandler,
      fileUploadHandler
    },
    {
      imageInsertHandler
    }
  ]

  return (
    <>
      <Head>
        <title>Animation optimizer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <Menu
        hidden={menuHiddenState}
        menuHiddenHandler={menuHiddenHandler}
        fileUploadHandler={fileUploadHandler} 
        fileInsertHandler={fileInsertHandler}/>

      <main className={styles.main} style={{filter: menuHiddenState ? 'none' : 'blur(8px)'}}>
        <Content htmlContent={htmlContent} />
        <OptimizerSettings hidden={Boolean(!htmlContent)} />
      </main> */}

      <main>
        <StagesList 
          activeStage={activeStage} 
          changeStageHandler={changeStageHandler}
          stagesHandlers={stagesHandlers}
          content={content}/>
      </main>

      <footer className={styles.footer}>
      </footer>
    </>
  )
}


export default Home;
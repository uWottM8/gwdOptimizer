import { useState, useEffect } from "react";
import Head from 'next/head';
import Menu from './components/Menu/Menu';
import Content from './components/Content/Content';
import styles from '../styles/Home.module.css';


const Home = () => {
  const [menuHiddenState, setMenuHiddenState] = useState(true);
  const [animationFilesValue, setAnimationFilesValue] = useState(null);
  const menuHiddenHandler = (event) => {
    setMenuHiddenState(!menuHiddenState);
  }

  // const fileReader = new FileReader();
  // fileReader.addEventListener('load', (event) => {
  //   console.log(event.target.result);
  // })

  const fileUploadHandler = (event) => {
    // const input = event.target;
    // fileReader.readAsText(input.files[0]);
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Menu
        hidden={menuHiddenState}
        menuHiddenHandler={menuHiddenHandler}
        fileUploadHandler={fileUploadHandler} />

      <main className={styles.main}>
        <Content blurState={!menuHiddenState} />
      </main>

      <footer className={styles.footer}>
      </footer>
    </>
  )
}


export default Home;
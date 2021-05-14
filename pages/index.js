import {useState, useEffect} from "react";
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

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Menu hidden={menuHiddenState} menuHiddenHandler={menuHiddenHandler}/>

      <main className={styles.main}>
        <Content blurState={!menuHiddenState}/>
      </main>

      <footer className={styles.footer}>
      </footer>
    </>
  )
}


export default Home;
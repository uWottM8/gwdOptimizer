import {useState} from "react";
import styles from './Menu.module.css';
import menuData from './Menu.json';

import ContentUploader from '../ContentUploader/ContentUploader';
import ContentInserter from '../ContentInserter/ContentInserter';

const Menu = ({hidden, menuHiddenHandler, htmlUploadHandler, fileInsertHandler}) => {
    const { menuItems } = menuData;
    const menuElementsList = [
        <ContentUploader htmlUploadHandler={htmlUploadHandler}/>,
        <ContentInserter fileInsertHandler={fileInsertHandler}/>
    ];

    return (
        <nav className={styles.menu}>
            <button className={styles.menu__navBtn} onClick={menuHiddenHandler}>
                <svg width="32" height="32" viewBox="0 0 24 24">
                    <title>Menu</title>
                    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
                </svg>
            </button>
            <ul className={`${styles.menu__list}${hidden ? " " + styles.menu__list_hidden : ""}`}>
                {
                    menuItems.map((item) => (
                        <li key={item.key} className={styles.menu__item}>
                            {item.title}
                            {menuElementsList[item.key]}
                        </li>
                    ))
                }
            </ul>
        </nav>
    );
}

export default Menu;
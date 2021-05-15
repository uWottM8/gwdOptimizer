import {useState} from "react";
import styles from './Menu.module.css';
import menuData from './Menu.json';

const Menu = ({hidden, menuHiddenHandler, fileUploadHandler}) => {
    const { menuItems } = menuData;

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
                            {
                                item.key === 0
                                    ? (
                                        <input 
                                        type="file" 
                                        name="file" 
                                        accept=".html"
                                        onChange={fileUploadHandler}/>
                                        ) : null
                            }
                        </li>
                    ))
                }
            </ul>
        </nav>
    );
}

export default Menu;
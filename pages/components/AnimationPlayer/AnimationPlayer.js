import styles from './AnimationPlayer.module.css';

const AnimationPlayer = ({restartAnimationEvent, toggleAnimationPlayEvent, animationPlayState}) => {
    return (
        <div className={styles.animationPlayer}>
            <button
                className={styles.animationPlayer__control} 
                onClick={restartAnimationEvent}
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16" 
                    fill="currentColor" 
                >
                    <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z"/>
                </svg>
            </button>
            <button
                className={styles.animationPlayer__control} 
                onClick={toggleAnimationPlayEvent}>
                    { animationPlayState === 'running' 
                        ? (<svg 
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5zm3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5z"/>
                            </svg>)
                        : (
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="currentColor"
                                viewBox="0 0 16 16"
                            >
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/>
                            </svg>
                        )}
            </button>
        </div>
    );
}

export default AnimationPlayer;
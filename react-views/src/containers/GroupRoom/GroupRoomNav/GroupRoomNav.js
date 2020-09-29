import React from 'react'
import styles from './GroupRoomNav.module.scss'
import Skeleton from '@material-ui/lab/Skeleton';

const groupRoomNav = (props) => {
    return(
        <div className={styles.NavContainer}>
            <div className={styles.GroupRoomNavigation}>
                <ul>
                    <li
                    onClick={() => props.toggleComponent(0)}
                    className={props.compLoaded === 0 ? styles.active : null}
                    >
                        Chat
                    </li>
                    <li 
                    onClick={() => props.toggleComponent(1)}
                    className={props.compLoaded === 1 ? styles.active : null}
                    >
                        Events
                    </li>
                    <li 
                    onClick={() => props.toggleComponent(2)}
                    className={props.compLoaded === 2 ? styles.active : null}
                    >
                        About
                    </li>
                </ul>
            </div>
            <div className={styles.GroupInfo}>
                {
                    props.ajaxDone ? (
                        <img src={ props.groupObject.imageUrl } alt="Group logo" />
                    ) : <Skeleton variant="circle" width={100} height={100} />
                }
                <p>{ props.groupObject.name }</p>
            </div>
        </div>
    );
}

export default groupRoomNav;
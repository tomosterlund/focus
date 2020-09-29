import React from 'react'
import styles from './Backdrop.module.scss'

const backdrop = (props) => (
    <div
    className={styles.Backdrop}
    onClick={props.click}
    >
    </div>
);

export default backdrop;
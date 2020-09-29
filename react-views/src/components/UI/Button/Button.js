import React from 'react'
import styles from './Button.module.scss'

const button = props => (
    <button
    style={{
        backgroundColor: props.color,
        border: props.borderStyle
    }}
    className={styles.Button}
    onClick={props.click}
    >
        {props.children}
    </button>
);

export default button;
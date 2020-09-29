import React from 'react'
import styles from './MessageBox.module.scss'

const MessageBox = (props) => (
    <div
    className={ props.show === false ? [styles.MessageBox, styles.Hide].join(' ') : [styles.MessageBox, styles.Show].join(' ') }
    style={{ backgroundColor: props.backgroundColor, color: props.color, position: props.position, left: props.left, top: props.top }}
    >
        { props.children }
    </div>
);

export default MessageBox;
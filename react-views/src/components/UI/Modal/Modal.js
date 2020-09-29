import React, { Fragment } from 'react'
import styles from './Modal.module.scss'

const AppModal = (props) => (
    <Fragment>
        <div className={styles.AppModal}>
            {props.children}
        </div>
    </Fragment>
);

export default AppModal;
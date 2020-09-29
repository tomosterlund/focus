import React from 'react'
import styles from './GroupSummary.module.scss'
import { People } from '@material-ui/icons';
import Chip from '@material-ui/core/Chip';

const GroupSummary = (props) => (
    <span onClick={() => props.click(props.group._id)} className={styles.GroupSummary}>
        <div className={styles.GroupImage} style={{ backgroundImage: `url('${process.env.REACT_APP_AWS_BUCKET}${props.group.imageUrl}')` }}></div>
        <div className={styles.TextBox}>
            <p>{props.group.name}</p>
            <Chip style={{ margin: '0 8px 0 0' }} avatar={<People />} label={props.group.members.length} />
        </div>
    </span>
);

export default GroupSummary;
import React from 'react'
import styles from './ChatMessage.module.scss'
import { useSelector } from "react-redux";
import { Delete, ExpandMore } from '@material-ui/icons';

import Popover from '@material-ui/core/Popover';

const ChatMessage = (props) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };

    const handleClose = () => {
        setAnchorEl(null);
      };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;


    const sessionUser = useSelector(state => state.sessionUser);
    const adminStatus = useSelector(state => state.checkIfAdmin);

    return(
        <div className={styles.ChatMessage}>
            {
                sessionUser._id === props.message.authorId || adminStatus ? (
                    <div className={styles.TrashIcon} style={{ position: 'absolute', top: '4px', right: '8px' }} >
                        <ExpandMore aria-describedby={id} variant="contained" color="primary" onClick={handleClick} />
                        <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                        }}
                        transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                        }}
                        >
                            <div onClick={() => props.deletePost(props.message._id)} className={styles.Popover}>
                                <Delete />
                                Delete post
                            </div>
                        </Popover>
                    </div>
                ) : null
            }
            <div className={styles.ImageDiv}>
                <div className={styles.AuthorImage} style={{ backgroundImage: `url('${process.env.REACT_APP_AWS_BUCKET}${props.message.authorImageUrl}')` }} alt="Author" />
            </div>
            <div className={styles.TextDiv}>
                <p className={styles.NameTag}>{props.message.authorName}</p>
                <p className={styles.TimeStamp}>
                    { `${props.message.date.substring(0, 10)}, at ${props.message.date.substring(11, 16)}` }
                </p>
                <p className={styles.BodyTag}>{props.message.text}</p>
            </div>
        </div>
    );
};

export default ChatMessage;
import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import styles from './UserInList.module.scss'
import moreStyles from './../../../containers/GroupRoom/GroupChat/ChatMessage/ChatMessage.module.scss'
import { Chip } from '@material-ui/core';
import { Add, Clear, ExpandMore, IndeterminateCheckBox } from '@material-ui/icons';
import Popover from '@material-ui/core/Popover';

const UserInList = (props) => {
    // Popover code
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };

    const handleClose = () => {
        setAnchorEl(null);
      };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    // Admin badge, add admin badge & delete user
    const checkIfAdmin = useSelector(state => state.checkIfAdmin);
    let adminStatus = false;
    const numberOfAdmins = props.groupObject.groupAdmins.length;
    const adminBadge = <Chip label="Admin" />
    props.groupObject.groupAdmins.map(a => a === props.userId ? adminStatus = true : null);
    const removeUserPopover = (
        <Fragment>
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
                    {
                        adminStatus && numberOfAdmins > 1 ? (
                            <div onClick={() => props.removeAdminStatus(props.userId)} className={moreStyles.Popover}>
                                <IndeterminateCheckBox style={{ margin: '0 8px 0 0' }} />
                                Remove admin status
                            </div>
                        ) : null
                    }
                    <div onClick={() => props.removeUserHandler(props.userId)} className={moreStyles.Popover}>
                        <Clear style={{ margin: '0 8px 0 0' }} />
                        Remove user from group
                    </div>
                </Popover>
        </Fragment>
    )
    


    return(
        <div className={styles.UserInList}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ backgroundImage: `url('${process.env.REACT_APP_AWS_BUCKET}${props.imageUrl}')` }} className={styles.UserImage}></div>
                <div className={styles.TextBox}>
                <h3>{props.name}</h3>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                { adminStatus ? adminBadge : null }
                {
                    checkIfAdmin && !adminStatus ? (
                        <Chip
                        clickable
                        avatar={<Add />}
                        label="Make admin"
                        onClick={() => props.addAdminHandler(props.userId)}
                        />
                    ) : null 
                }
                { checkIfAdmin ? removeUserPopover : null }
            </div>
        </div>
    );
}

export default UserInList;
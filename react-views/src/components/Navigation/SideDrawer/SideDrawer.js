import React, { Fragment } from 'react'
import styles from './SideDrawer.module.scss'
import { Close, Home, ExitToApp, AccountBox, People, Settings } from '@material-ui/icons';
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const SideDrawer = (props) => {
    const sessionUser = useSelector(state => state.sessionUser);

    if(props.drawerShow === true) {
        return(
            <div className={[styles.SideDrawer, styles.Show].join(' ')}>
                <Close className={styles.Close} onClick={props.toggleDrawer} />
                <nav>
                    <ul>
                        {!sessionUser ? (
                            <Fragment>
                                <li><Link onClick={props.toggleDrawer} to="/"><Home /><p>Home</p></Link></li>
                                <li><Link onClick={props.toggleDrawer} to="/login"><ExitToApp /><p>Sign in</p></Link></li>
                                <li><Link onClick={props.toggleDrawer} to="/register"><AccountBox /><p>Registration</p></Link></li>
                            </Fragment>
                        ) : null }
                        {sessionUser ? (
                            <Fragment>
                                <li style={{ backgroundColor: '#ebecf0', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                                    <div
                                    className={styles.UserImage}
                                    style={{ backgroundImage: `url('${process.env.REACT_APP_AWS_BUCKET}${sessionUser.imageUrl}')` }}
                                    ></div>
                                    <div className={styles.UserInfoText}>
                                        <p className={styles.SignedInAs}>Signed in as: </p>
                                        <p>{ sessionUser.name }<Settings onClick={props.openUserSettings} fontSize="small" style={{ margin: '0 0 0 16px' }} /></p>
                                    </div>
                                </li>
                                <li><Link onClick={props.toggleDrawer} to="/"><Home /><p>Home</p></Link></li>
                                <li><Link onClick={props.toggleDrawer} to="/groups"><People /><p>Groups</p></Link></li>
                                <li><Link onClick={props.signout} to="/"><ExitToApp /><p>Sign out</p></Link></li>
                            </Fragment>
                        ) : null }
                    </ul>
                </nav>
            </div>
        )
    }
    return(
        <div className={[styles.SideDrawer, styles.Hide].join(' ')}></div>
    )
    
};

export default SideDrawer;
import React, { Component, Fragment } from 'react'
import classes from './AppHeader.module.scss'
import { Menu } from '@material-ui/icons';
import { connect } from 'react-redux';
import { setSession } from './../../actions/index'
import axios from 'axios'

class AppHeader extends Component {
    state = {
        toggle: false,
    }

    async componentDidMount() {
       if (!this.props.sessionUser) {
           console.log('No signed in user');
           const userVerification = await axios.get('/focusapi/verified');
           this.props.dispatch(setSession(userVerification.data.sessionUser));
       } 
    }

    render() {
        return (
            <Fragment>
                <header className={classes.Header}>
                    <div className={classes.LeftContainer}>
                        <Menu
                        className={classes.MenuToggle}
                        onClick={this.props.toggleDrawer} 
                        />
                        <div className={classes.Logo}>FOCUS</div>
                    </div>
                    {/* <div className={classes.RightContainer}>
                        <Popover />
                    </div> */}
                </header>
            </Fragment>
        )
    }
    
};

function mapStateToProps(state) {
    return {
      sessionUser: state.sessionUser
    }
  }

export default connect(mapStateToProps)(AppHeader);
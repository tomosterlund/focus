import React, { Fragment, Component } from 'react'
import AppHeader from './../AppHeader/AppHeader'
import Backdrop from './../UI/Backdrop/Backdrop'
import SideDrawer from './../Navigation/SideDrawer/SideDrawer'
import axios from 'axios'
import { withRouter } from 'react-router-dom'

class Layout extends Component {
    state = {
        drawerShow: false
    }

    toggleDrawer = () => {
        this.setState({ drawerShow: !this.state.drawerShow });
    }

    signoutHandler = async () => {
        this.setState({ drawerShow: !this.state.drawerShow });
        try {
            const signOut = await axios.get('/focusapi/signout');
            console.log(signOut);
            window.location.reload();
            this.props.history.push('/');

        } catch (err) {
            console.log(err);
        }
    }

    openUserSettings = () => {
        this.setState({ drawerShow: !this.state.drawerShow });
        this.props.history.push('/edit-user');
    }

    render() {
        let backdrop = null;
        if (this.state.drawerShow === true) {
            backdrop = <Backdrop click={ this.toggleDrawer } />
        }

        return(
            <Fragment>
                { backdrop }
                <SideDrawer
                drawerShow={this.state.drawerShow}
                toggleDrawer={this.toggleDrawer}
                signout={this.signoutHandler}
                openUserSettings={this.openUserSettings}
                />
                <AppHeader toggleDrawer={this.toggleDrawer} />
                <main>
                    {this.props.children}
                </main>
            </Fragment>
        )
    }
}

export default withRouter(Layout);
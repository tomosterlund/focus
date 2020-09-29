import React, { Component, Fragment, Suspense } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from "react-redux";
import styles from './HomePage.module.scss'
import BGImage from './../../assets/bg-image.jpeg'
import Button from './../../components/UI/Button/Button'
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios'
const Backdrop = React.lazy(() => import('./../../components/UI/Backdrop/Backdrop')); 
const Modal = React.lazy(() => import('./../../components/UI/Modal/Modal')); 
const CreateGroup = React.lazy(() => import('./CreateGroup/CreateGroup'));

class HomePage extends Component {
    state = {
        componentLoaded: 0,
        joinCodeInput: '',
        progressSpinner: false
    }

    openCreateGroup = () => {
        this.setState({ componentLoaded: 2 });
    }

    openModalHandler = () => {
        this.setState({ componentLoaded: 1 });
    }

    comeBackHome = () => {
        this.setState({ componentLoaded: 0 });
    }

    joinGroupHandler = async () => {
        this.setState({ progressSpinner: true });
        const d = {
            joinCode: this.state.joinCodeInput
        }
        try {
            const join = await axios.post('/focusapi/groups/join', d);
            console.log(join);
            this.props.history.push('/groups');
            this.setState({ progressSpinner: false });
        } catch (error) {
            console.error();
        }
    }

    changeInput = (event) => {
        const joinCodeInput = event.target.value;
        this.setState({ joinCodeInput });
    }

    render() {
        let loadedComp = null;
        if (this.state.componentLoaded === 0 && this.props.sessionUser) {
            loadedComp = (
                <span className={styles.CenterSpan}>
                    <h2>A place for ideas to take shape</h2>
                    <Button 
                    click={this.openModalHandler}
                    color={'rgb(255, 153, 0)'}
                    borderStyle={'1px solid rgb(255, 153, 0)'}
                    >
                        Join a group
                    </Button>
                    <Button 
                    click={this.openCreateGroup}
                    color={'#05668d'}
                    borderStyle={'1px solid #05668d'}
                    >
                        Create group
                    </Button>
                </span>
            )
        } else if (this.state.componentLoaded === 0 && !this.props.sessionUser) {
            loadedComp = (
                <span className={styles.CenterSpan}>
                    <h2>A place for ideas to take shape</h2>
                    <Button 
                    click={() => this.props.history.push('/register')}
                    color={'#05668d'}
                    borderStyle={'1px solid #05668d'}
                    >
                        Register now
                    </Button>
                    <Button 
                    click={() => this.props.history.push('/login')}
                    color={'rgb(255, 153, 0)'}
                    borderStyle={'rgb(255, 153, 0)'}
                    >
                        Sign in
                    </Button>
                </span>
            )
        } else if (this.state.componentLoaded === 2) {
            loadedComp = (
                    <Suspense fallback={<CircularProgress style={{ position: 'fixed', top: '40%', left: 'auto' }} />}>
                        <CreateGroup 
                        goBack={this.comeBackHome}
                        openComp={this.state.componentLoaded}
                        />
                    </Suspense>
            )
        } else if (this.state.componentLoaded === 1) {
            loadedComp = (
                <Suspense fallback={<CircularProgress style={{ position: 'fixed', top: '40%', left: 'auto' }} />}>
                    <Fragment>
                        <Backdrop click={this.comeBackHome} />
                        <Modal>
                            <h1>Join with code</h1>
                            <TextField
                            label="Group access code"
                            value={this.state.joinCodeInput}
                            onChange={this.changeInput}
                            />
                            {
                                !this.state.progressSpinner ? <Button
                                color={'#05668d'}
                                borderStyle={'1px solid #05668d'}
                                click={this.joinGroupHandler}
                                >
                                    Join group
                                </Button>  : <CircularProgress style={{ margin: '18px auto', display: 'block' }} />
                            }
                            
                        </Modal>
                    </Fragment>
                </Suspense>
            )
        }

        return(
            <Fragment>
                <div style={{ backgroundImage: `url('${BGImage}')` }} className={styles.HomePageImage}>
                    {/* <h1>Welcome</h1> */}
                    { loadedComp }
                </div>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    sessionUser: state.sessionUser
  });

export default connect(mapStateToProps)(withRouter(HomePage));
import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import styles from './Registration.module.scss'
import defaultBG from './../GroupRoom/GroupRoom.module.scss'
import Button from './../../components/UI/Button/Button'
import axios from 'axios'
import { setSession } from './../../actions/index'
import { connect } from 'react-redux'
import MessageBox from './../../components/UI/MessageBox/MessageBox'

class Login extends Component {
    state = {
        email: '',
        password: '',
        progressSpinner: false,
        errorMessage: ''
    }

    updateInputField = (event, inputField) => {
        const newValue = event.target.value;
        const updatedState = {...this.state}
        updatedState[inputField] = newValue;
        this.setState({...updatedState});
    }

    loginHandler = async () => {
        this.setState({ progressSpinner: true });
        const userLogin = {
            email: this.state.email,
            password: this.state.password
        }
        try {
            const loginAttempt = await axios.post('/focusapi/login', userLogin);
            console.log(loginAttempt);
            if (loginAttempt.data.sessionUser) {
                this.props.dispatch(setSession(loginAttempt.data.sessionUser));
                this.setState({ progressSpinner: false });
                this.props.history.push('/groups');
                return;
            } else if (loginAttempt.data.error === 'email') {
                this.setState({ errorMessage: 'Could not find a user registered with this e-mail address.' });
                this.setState({ progressSpinner: false });
            } else if (loginAttempt.data.error === 'password') {
                this.setState({ errorMessage: 'Incorrect password' });
                this.setState({ progressSpinner: false });
            } else {
                this.setState({ errorMessage: 'Something went wrong. Please try again'});
                this.setState({ progressSpinner: false });
            }
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        const spinner = <CircularProgress style={{ margin: '16px 0 16px 0' }} />

        return(
            <span className={[styles.Registration, defaultBG.GroupRoomContainer].join(' ')}>
                <span className="WhiteContainer">
                    <h1>Login</h1>
                    <TextField 
                    value={this.state.email} 
                    style={{ width: '90%', margin: '8px 0 8px 0' }} 
                    label="E-mail" 
                    onChange={(event) => this.updateInputField(event, 'email')}
                    />
                    <TextField 
                    value={this.state.password} 
                    type="password" 
                    style={{ width: '90%', margin: '8px 0 8px 0' }} 
                    label="Password" 
                    onChange={(event) => this.updateInputField(event, 'password')}
                    />
                    {
                        !this.state.progressSpinner ? <Button
                        click={this.loginHandler}
                        color={'#05668d'}
                        borderStyle={'1px solid #05668d'}
                        >
                            Done
                        </Button> : spinner 
                    }
                    {
                        this.state.errorMessage ? (
                            <MessageBox
                            color="black"
                            backgroundColor="#f08080"
                            position="static">
                                <ul>
                                    <li>{ this.state.errorMessage }</li>
                                </ul>
                            </MessageBox>
                        ) : null
                    }
                    
                </span>
            </span>
        );
    }
}

export default connect()(Login);
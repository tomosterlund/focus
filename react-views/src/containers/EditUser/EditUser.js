import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import MaterialButton from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { AddAPhoto } from '@material-ui/icons';
import styles from './../RegistrationLogin/Registration.module.scss'
import defaultBG from './../GroupRoom/GroupRoom.module.scss'
import Button from './../../components/UI/Button/Button'
import axios from 'axios'
import MessageBox from "./../../components/UI/MessageBox/MessageBox";
import { setSession } from './../../actions/index'
import { connect } from 'react-redux'

class EditUser extends Component {
    constructor(props) {
        super(props);
        this.fileInput = React.createRef();
    }
    state = {
        name: '',
        email: '',
        password: '',
        pwConfirm: '',
        file: '',
        selectedFile: null,
        imagePreviewUrl: '',
        progressSpinner: false,
        validForm: false,
        showValidationError: false,
        validationErrors: []
    }

    async componentDidMount() {
        try {
            const userDetails = await axios.get('/focusapi/edit-user');
            this.setState({ name: userDetails.data.user.name });
            this.setState({ email: userDetails.data.user.email });
        } catch (error) {
            console.log(error);
        }
    }

    formValidation = () => {
        const newState = this.state;
        newState.validationErrors = [];
        this.setState({ ...newState });

        let checkToggle = true;
        if (this.state.name.trim().length === 0 || this.state.name.trim().length >= 60) {
            console.log('Invalid name');
            let updatedState = this.state;
            updatedState.validationErrors.push('Name is a required field');
            this.setState({ ...updatedState });
            checkToggle = false;
        }

        if (this.state.email.trim().length <= 5 || this.state.email.trim().length >= 60 ) {
            console.log('Invalid email');
            let updatedState = this.state;
            updatedState.validationErrors.push('Enter a valid E-mail address');
            this.setState({ ...updatedState })
            checkToggle = false;
        }

        if (this.state.password.trim().length <= 6 || this.state.password.trim().length > 60) {
            console.log('Password needs to contain at least 7 characters');
            let updatedState = this.state;
            updatedState.validationErrors.push('Enter a password with at least 7 characters');
            this.setState({ ...updatedState })
            checkToggle = false;
        }

        if (this.state.pwConfirm !== this.state.password) {
            console.log('Passwords do not match');
            let updatedState = this.state;
            updatedState.validationErrors.push('Passwords need to match');
            this.setState({ ...updatedState })
            checkToggle = false;
        }
        
        if (checkToggle) {
            let s = this.state;
            s.validForm = true;
            this.setState({ ...s });
            return;
        }
    }

    updateInputField = (event, inputField) => {
        const newValue = event.target.value;
        const updatedState = {...this.state}
        updatedState[inputField] = newValue;
        this.setState({...updatedState});
    }

    saveUserEdit = async () => {
        this.formValidation();
        if (this.state.validForm) {
            console.log('Successfully registered')
            this.setState({ progressSpinner: true });
            const userObject = {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password
            }
            let fd = new FormData();
            fd.append('image', this.state.selectedFile);
            fd.append('details', JSON.stringify(userObject));
            try {
                const postRegister = await axios.post('/focusapi/edit-user', fd);
                console.log(postRegister);
                this.props.dispatch(setSession(postRegister.data.updatedUser));
                this.setState({ progressSpinner: false });
                this.props.history.push('/groups');
            } catch(err) {
                console.log(err);
            }
        }
        console.log('Display error message');
        this.setState({ showValidationError: true });
    }

    openFilePicker = () => {
        this.fileInput.current.click();
    }

    getPhoto = e => {
        if (!e.target.files[0]) {return}
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];
        console.log(file);

        reader.onloadend = () => {
          this.setState({
            selectedFile: file,
            file: file.name,
            imagePreviewUrl: reader.result
          });
        }

        reader.readAsDataURL(file);
    }

    toggleErrorMessage = () => {
        this.setState({ showValidationError: true });
        setTimeout(() => {
            this.setState({ showValidationError: false });
        }, 3000);
    }

    render() {
        const spinner = <CircularProgress style={{ margin: '0 0 16px 0' }} />

        return(
            <span className={[styles.Registration, defaultBG.GroupRoomContainer].join(' ')}>
                <span className="WhiteContainer">
                    <h1>Edit your details</h1>
                    <TextField
                    value={this.state.name}
                    style={{ width: '90%', margin: '8px 0 8px 0' }}
                    label="Full name"
                    onChange={(event) => this.updateInputField(event, 'name')}
                    />
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
                    label="Password (new or old)" 
                    onChange={(event) => this.updateInputField(event, 'password')}
                    />
                    <TextField 
                    value={this.state.pwConfirm} 
                    type="password" 
                    style={{ width: '90%', margin: '8px 0 8px 0' }} 
                    label="Confirm password" 
                    onChange={(event) => this.updateInputField(event, 'pwConfirm')}
                    />
                    <MaterialButton onClick={this.openFilePicker} style={{ margin: '8px 0 8px 0' }}><AddAPhoto /><p className={styles.ButtonText}>Change image</p></MaterialButton>
                    <input ref={this.fileInput} onChange={this.getPhoto} type="file" style={{ display: 'none' }} />
                    <p>{this.state.file}</p>
                    {
                        this.state.showValidationError ? <MessageBox
                        show={this.state.showValidationError}
                        color="black"
                        backgroundColor="#f08080"
                        position="static"
                        >
                            <ul>
                            {this.state.validationErrors.map(e => (
                                <li key={e}>{e}</li>
                            ))}
                            </ul>
                        </MessageBox> : null
                    }
                    {
                        !this.state.progressSpinner ? <Button
                        click={this.saveUserEdit}
                        color={'#05668d'}
                        borderStyle={'1px solid #05668d'}
                        >
                            Save details
                        </Button> : spinner
                    }
                </span>
            </span>
        );
    }
}

export default connect()(EditUser);
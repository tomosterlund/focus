import React, { Component } from 'react'
import styles from './CreateGroup.module.scss'
import TextField from '@material-ui/core/TextField';
import { ArrowBack } from '@material-ui/icons';
import Button from './../../../components/UI/Button/Button'
import MaterialButton from '@material-ui/core/Button';
import { AddAPhoto } from '@material-ui/icons';
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress';

class CreateGroup extends Component {
    constructor(props) {
        super(props);
        this.fileInput = React.createRef();
    }

    state = {
        file: '',
        imagePreviewUrl: '',
        selectedFile: null,
        groupName: '',
        groupDescription: '',
        progressSpinner: false
    }

    updateInputField = (event, inputField) => {
        const newValue = event.target.value;
        const updatedState = {...this.state}
        updatedState[inputField] = newValue;
        this.setState({...updatedState});
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

    registerGroupHandler = async () => {
        this.setState({ progressSpinner: true });
        console.log(this.props)
        const groupObject = {
            name: this.state.groupName,
            description: this.state.groupDescription
        }
        const stringifiedObject = JSON.stringify(groupObject);
        console.log(stringifiedObject);
        let fd = new FormData();
        fd.append('groupdetails', stringifiedObject);
        fd.append('image', this.state.selectedFile);
        try {
            const postGroup = await axios.post('/focusapi/groups/create-group', fd);
            console.log(postGroup);
            this.setState({ progressSpinner: false });
            this.props.history.push('/groups');
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        const spinner = <CircularProgress style={{ margin: '0 0 16px 0' }} />

        return(
            <span className={styles.CreateGroup}>
                <span 
                className={styles.GoBack}
                onClick={this.props.goBack}
                >
                    <ArrowBack />
                    Go back
                </span>
                <h1>Gather your peeps!</h1>
                <TextField 
                style={{ width: '90%' }} 
                label="Group name" 
                value={this.state.groupName}
                onChange={(event) => this.updateInputField(event, 'groupName')}
                />
                <TextField 
                multiline 
                style={{ width: '90%', marginTop: '16px' }} 
                label="About the group" 
                value={this.state.groupDescription}
                onChange={(event) => this.updateInputField(event, 'groupDescription')}
                />
                <MaterialButton onClick={this.openFilePicker} style={{ margin: '8px 0 8px 0' }}><AddAPhoto /><p className={styles.ButtonText}>Upload image</p></MaterialButton>
                <input ref={this.fileInput} onChange={this.getPhoto} type="file" style={{ display: 'none' }} />
                <p>{this.state.file}</p>
                {
                    !this.state.progressSpinner ? <Button 
                    click={this.registerGroupHandler}
                    color={'#05668d'}
                    borderStyle={'1px solid #05668d'}
                    >
                        Create group now
                    </Button> : spinner
                }
                
            </span>
        )
    }
}

export default withRouter(CreateGroup);
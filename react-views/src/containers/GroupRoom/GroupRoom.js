import React, {Component, Fragment, Suspense} from 'react'
import { connect } from 'react-redux'
import { setAdminStatus, setAdminStatusToFalse } from './../../actions/index'
import openSocket from 'socket.io-client'
import styles from './GroupRoom.module.scss'
import GroupRoomNav from './GroupRoomNav/GroupRoomNav'
import GroupChat from './GroupChat/GroupChat'
import AboutGroup from './AboutGroup/AboutGroup'
import GroupEvents from './GroupEvents/GroupEvents'
import axios from 'axios'
import { CircularProgress } from '@material-ui/core'
const AddEvent = React.lazy(() => import('./AddEvent/AddEvent'));
const EditEvent = React.lazy(() => import('./EditEvent/EditEvent'));

class GroupRoom extends Component {
    state = {
        loadedGroup: {
            name: '',
            imageUrl: '',
            description: '',
            _id: '',
            joinCode: '',
            groupAdmins: []
        },
        loadedMessages: [],
        loadedEvents: [],
        groupMembers: [],
        componentLoad: 0,
        userInput: '',
        progressSpinner: false,
        toggleAddEvent: false,
        selectedDate: '',
        selectedTime: '',
        eventName: '',
        eventDescription: '',
        eventLocation: '',
        showCopyMessage: false,
        toggleEditEvent: false,
        editEventId: '',
        ajaxDone: false
    }

    async componentDidMount() {
        const routeParam = this.props.match.params.groupId;
        try {
            // Load group info
            const loadedGroup = await axios.get(`/focusapi/groups/${routeParam}`);
            const updatedGroup = {
                name: loadedGroup.data.loadedGroup.name,
                description: loadedGroup.data.loadedGroup.description,
                imageUrl: `${process.env.REACT_APP_AWS_BUCKET}${loadedGroup.data.loadedGroup.imageUrl}`,
                _id: loadedGroup.data.loadedGroup._id,
                joinCode: loadedGroup.data.loadedGroup.joinCode,
                groupAdmins: loadedGroup.data.loadedGroup.admins
            }
            this.setState({ loadedGroup: updatedGroup });
            this.setState({ loadedMessages: loadedGroup.data.groupMessages });
            this.setState({ groupMembers: loadedGroup.data.groupMembers });
            this.setState({ loadedEvents: loadedGroup.data.loadedEvents });

            // Check if sessionUser = group admin
            for (let a of loadedGroup.data.loadedGroup.admins) {
                if (a === this.props.sessionUser._id) {
                    this.props.dispatch(setAdminStatus());
                }
            }

            // Socket.io
            const socket = openSocket('http://localhost:5000');
            socket.on('chat message', (data) => {
                if (data.groupId === this.state.loadedGroup._id) {
                    this.setState({ loadedMessages: data.groupMessages });
                }
            });
            socket.on('hello world', () => console.log('Server says: "hello, world"'));
            this.setState({ ajaxDone: true });
        } catch (error) {
            console.log(error);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // Check if sessionUser = group admin
        if (prevState.loadedGroup !== this.state.loadedGroup) {
            for (let a of this.state.loadedGroup.groupAdmins) {
                if (a === this.props.sessionUser._id) {
                    return this.props.dispatch(setAdminStatus());
                }
                this.props.dispatch(setAdminStatusToFalse());
            }
        }
    }

    toggleComponent = compNumber => {
        let c = compNumber;
        this.setState({ componentLoad: c });
    }

    changeInputHandler = event => {
        const userInput = event.target.value;
        this.setState({ userInput });
    }

    sendMessageHandler = async () => {
        this.setState({ progressSpinner: true });
        const userInput = this.state.userInput;
        const postData = {
            text: userInput,
            groupId: this.state.loadedGroup._id
        }
        try {
            const postedMessage = await axios.post('/focusapi/chat/create-message', postData);
            console.log(postedMessage);
            this.setState({ userInput: '' });
            this.setState({ progressSpinner: false });
            this.setState({ loadedMessages: postedMessage.data.groupMessages });
            console.log(this.state.loadedMessages);
        } catch (error) {
            console.error();
        }
    }

    toggleAddEvent = () => {
        this.setState({ eventName: '' });
        this.setState({ eventDescription: '' });
        this.setState({ eventLocation: '' });
        this.setState({ selectedTime: '' });
        console.log('clicked')
        const toggleModal = !this.state.toggleAddEvent
        this.setState({ toggleAddEvent: toggleModal });
    }
    
    addEventChangeInputHandler = (event, field) => {
        console.log(event.target.value);
        const updatedState = this.state;
        updatedState[field] = event.target.value;
        this.setState({ ...updatedState });
    }

    addNewEvent = async () => {
        console.log('Registered event');
        this.setState({ progressSpinner: true });
        const eventObject = {
            name: this.state.eventName,
            text: this.state.eventDescription,
            date: this.state.selectedDate,
            time: this.state.selectedTime,
            location: this.state.eventLocation,
            groupId: this.state.loadedGroup._id
        }
        try {
            const groupEventsRes = await axios.post('/focusapi/events/create-new', eventObject)
            console.log(groupEventsRes);
            this.setState({ loadedEvents: groupEventsRes.data.groupEvents });
            this.setState({ progressSpinner: false });
            this.setState({ toggleAddEvent: false });
        } catch (error) {
            console.log(error);
        }
    }

    toggleCopyInvitationMessage = () => {
        this.setState({ showCopyMessage: true });
        setTimeout(() => {
            this.setState({ showCopyMessage: false });
        }, 1500)
    }

    deletePost = async (messageId) => {
        try {
            const deletePost = await axios.delete(`/focusapi/chat/delete-message/${messageId}`);
            console.log(deletePost);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    editEvent = async (eventId) => {
        const eventDetails = await axios.get(`/focusapi/events/${eventId}`);
        console.log(eventDetails);
        this.setState({ eventName: eventDetails.data.event.name });
        this.setState({ eventDescription: eventDetails.data.event.text });
        this.setState({ eventLocation: eventDetails.data.event.location });
        this.setState({ selectedTime: eventDetails.data.event.time });
        this.setState({ editEventId: eventDetails.data.event._id });
        this.setState({ toggleEditEvent: true });
        this.setState({ componentLoad: 3 });
    }

    saveChangesToEvent = async () => {
        this.setState({ progressSpinner: true });
        const eventObject = {
            name: this.state.eventName,
            text: this.state.eventDescription,
            date: this.state.selectedDate,
            time: this.state.selectedTime,
            location: this.state.eventLocation,
            groupId: this.state.loadedGroup._id,
            eventId: this.state.editEventId
        }
        try {
            const groupEventsRes = await axios.post(`/focusapi/events/edit/${this.state.editEventId}`, eventObject)
            console.log(groupEventsRes);
            this.setState({ loadedEvents: groupEventsRes.data.groupEvents });
            this.setState({ progressSpinner: false });
            this.setState({ toggleEditEvent: false });
            this.setState({ componentLoad: 1 });
        } catch (error) {
            console.log(error);
        }
    }

    goBackFromEdit = () => {
        this.setState({ toggleEditEvent: false });
        this.setState({ componentLoad: 1});
    }

    deleteEvent = async () => {
        this.setState({ progressSpinner: true });
        const eventId = this.state.editEventId;
        try {
            const deleteEvent = await axios.delete(`/focusapi/events/delete/${eventId}`);
            console.log({ deleteEvent });
            this.setState({ loadedEvents: deleteEvent.data.groupEvents });
            this.setState({ progressSpinner: false });
            this.setState({ toggleEditEvent: false });
            this.setState({ componentLoad: 1 });
        } catch (error) {
            console.log(error);
        }
    }

    addAdminHandler = async (userId) => {
        const groupId = this.state.loadedGroup._id;
        const postObject = {
            userId,
            groupId
        }
        try {
            console.log('hooked up properly')
            const loadedGroup = await axios.post('/focusapi/groups/add-admin', postObject);
            const updatedGroup = {
                name: loadedGroup.data.loadedGroup.name,
                description: loadedGroup.data.loadedGroup.description,
                imageUrl: `${process.env.REACT_APP_AWS_BUCKET}${loadedGroup.data.loadedGroup.imageUrl}`,
                _id: loadedGroup.data.loadedGroup._id,
                joinCode: loadedGroup.data.loadedGroup.joinCode,
                groupAdmins: loadedGroup.data.loadedGroup.admins
            }
            console.log(updatedGroup);
            this.setState({ loadedGroup: updatedGroup });
        } catch (error) {
            console.log(error);
        }
    }

    removeUserHandler = async (userId) => {
        console.log('hooked up')
        const groupId = this.state.loadedGroup._id;
        const postObject = {
            groupId,
            userId
        }
        try {
            const loadedGroup = await axios.post('/focusapi/groups/remove-member', postObject);
            const updatedGroup = {
                name: loadedGroup.data.loadedGroup.name,
                description: loadedGroup.data.loadedGroup.description,
                imageUrl: `${process.env.REACT_APP_AWS_BUCKET}${loadedGroup.data.loadedGroup.imageUrl}`,
                _id: loadedGroup.data.loadedGroup._id,
                joinCode: loadedGroup.data.loadedGroup.joinCode,
                groupAdmins: loadedGroup.data.loadedGroup.admins
            }
            this.setState({ loadedGroup: updatedGroup });
            this.setState({ groupMembers: loadedGroup.data.groupMembers });
        } catch (error) {
            console.log(error);
        }
    }

    removeAdminStatus = async (userId) => {
        const groupId = this.state.loadedGroup._id;
        const postObject = {
            groupId,
            userId
        }
        try {
            const loadedGroup = await axios.post('/focusapi/groups/remove-admin', postObject);
            const updatedGroup = {
                name: loadedGroup.data.loadedGroup.name,
                description: loadedGroup.data.loadedGroup.description,
                imageUrl: `${process.env.REACT_APP_AWS_BUCKET}${loadedGroup.data.loadedGroup.imageUrl}`,
                _id: loadedGroup.data.loadedGroup._id,
                joinCode: loadedGroup.data.loadedGroup.joinCode,
                groupAdmins: loadedGroup.data.loadedGroup.admins
            }
            this.setState({ loadedGroup: updatedGroup });
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        let componentLoad = null;
        if (this.state.componentLoad === 0) {
            componentLoad = <GroupChat
            sendMessageHandler={this.sendMessageHandler}
            changeInputHandler={this.changeInputHandler}
            userInput={this.state.userInput}
            messages={this.state.loadedMessages}
            progressSpinner={this.state.progressSpinner}
            deletePost={this.deletePost}
            />
        } else if (this.state.componentLoad === 1 && this.state.toggleAddEvent === false) {
            componentLoad = <GroupEvents
            events={this.state.loadedEvents}
            click={this.toggleAddEvent}
            editEvent={this.editEvent}
            />
        } else if (this.state.componentLoad === 2) {
            componentLoad = <AboutGroup
            groupMembers={this.state.groupMembers}
            groupObject={this.state.loadedGroup}
            showCopyMessage={this.state.showCopyMessage}
            toggleMessage={this.toggleCopyInvitationMessage}
            addAdminHandler={this.addAdminHandler}
            removeUserHandler={this.removeUserHandler}
            removeAdminStatus={this.removeAdminStatus}
            />
        }

        let modalLoad = null;
        if (this.state.toggleAddEvent && this.state.componentLoad !== 0 && this.state.componentLoad !== 2) {
            modalLoad = (
                <Suspense fallback={<CircularProgress style={{ position: 'fixed', top: '40%', left: 'auto' }} />}>
                    <AddEvent
                    selectedTime={this.state.selectedTime}
                    selectedDate={this.state.selectedDate}
                    eventName={this.state.eventName}
                    eventDescription={this.state.eventDescription}
                    eventLocation={this.state.eventLocation}
                    goBack={this.toggleAddEvent}
                    changeHandler={this.addEventChangeInputHandler}
                    addEvent={this.addNewEvent}
                    progressSpinner={this.state.progressSpinner}
                    />
                </Suspense>
            )
        } else if (this.state.toggleEditEvent && this.state.componentLoad !== 0 && this.state.componentLoad !== 2) {
            modalLoad = (
                <Suspense fallback={<CircularProgress style={{ position: 'fixed', top: '40%', left: 'auto' }} />}>
                    <EditEvent
                    selectedTime={this.state.selectedTime}
                    selectedDate={this.state.selectedDate}
                    eventName={this.state.eventName}
                    eventDescription={this.state.eventDescription}
                    eventLocation={this.state.eventLocation}
                    goBackFromEdit={this.goBackFromEdit}
                    changeHandler={this.addEventChangeInputHandler}
                    editEvent={this.saveChangesToEvent}
                    deleteEvent={this.deleteEvent}
                    progressSpinner={this.state.progressSpinner}
                    />
                </Suspense>
            )
        }

        return(
            <Fragment>
                <section className={styles.GroupRoomContainer}>
                    <GroupRoomNav
                    toggleComponent={this.toggleComponent}
                    groupObject={this.state.loadedGroup}
                    compLoaded={this.state.componentLoad}
                    ajaxDone={this.state.ajaxDone}
                    />
                    { componentLoad }
                    { modalLoad }
                </section>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        checkIfAdmin: state.checkIfAdmin,
        sessionUser: state.sessionUser
    }
}

export default connect(mapStateToProps)(GroupRoom);
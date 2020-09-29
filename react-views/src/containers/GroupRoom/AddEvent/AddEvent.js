import React from 'react';
import styles from './AddEvent.module.scss'
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ArrowBack } from '@material-ui/icons';
import Button from './../../../components/UI/Button/Button'

const AddEvent = (props) => {
    const spinner = <CircularProgress style={{ margin: '16px 0 16px 0' }} />

    return(
        <div className={['WhiteContainer', styles.AddEvent].join(' ')}>
            <span 
            className={styles.GoBack}
            onClick={props.goBack}
            >
                <ArrowBack />
                Go back
            </span>
            <h2>Add new event</h2>
            <TextField
            label="Event name"
            className={styles.InputField}
            onChange={(event) => props.changeHandler(event, 'eventName')}
            value={props.eventName}
            />
            <TextField
            multiline
            label="Describe the event"
            className={styles.InputField}
            onChange={(event) => props.changeHandler(event, 'eventDescription')}
            value={props.eventDescription}
            />
            <TextField
            label="Location of the event"
            className={styles.InputField}
            onChange={(event) => props.changeHandler(event, 'eventLocation')}
            value={props.eventLocation}
            />
            <TextField
            type="date"
            className={styles.DateField}
            onChange={(event) => props.changeHandler(event, 'selectedDate')}
            value={props.selectedDate}
            />
            <TextField
            type="time"
            className={styles.DateField}
            onChange={(event) => props.changeHandler(event, 'selectedTime')}
            value={props.selectedTime}
            />
            {
                !props.progressSpinner ? <Button
                click={props.addEvent}
                color={'#05668d'}
                borderStyle={'1px solid #05668d'}
                >
                    Done
                </Button> : spinner
            }
            
        </div>
    )
}

export default AddEvent;
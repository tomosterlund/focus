import React, { Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import AppButton from './../../../../components/UI/Button/Button'
import CircularProgress from '@material-ui/core/CircularProgress';

const ChatInput = (props) => (
    <Fragment>
        <div className="WhiteContainerFlex">
            <TextField
            multiline
            value={props.userInput}
            style={{ width: '70%', margin: '8px 0 8px 8px' }} 
            label="Write a message"
            onChange={props.changeInputHandler}
            />
            {
                !props.progressSpinner ? <AppButton
                color={'#05668d'}
                borderStyle={'1px solid #05668d'}
                click={props.click}
                >
                    Send
                </AppButton> : <CircularProgress style={{ margin: '16px 0 16px 32px' }} />
            }
        </div>
    </Fragment>
);

export default ChatInput;
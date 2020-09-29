import React, { Fragment } from 'react'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { CheckCircleOutline } from '@material-ui/icons';
import UserInList from './../../../components/UI/UserInList/UserInList'
import Chip from '@material-ui/core/Chip';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import MessageBox from "./../../../components/UI/MessageBox/MessageBox";

const aboutGroup = (props) => (
    <Fragment>
        <div className="WhiteContainer">
            <Card style={{width: '100%'}}>
                <CardContent>
                    <Typography variant="h6">
                        About this group
                    </Typography>
                    <Typography>
                        {props.groupObject.description}
                    </Typography>
                </CardContent>
            </Card>
        </div>
        <div className="WhiteContainer">
            <Card style={{width: '100%'}}>
                <CardContent>
                    <Typography variant="h6">
                        Members
                            <div style={{ margin: '0 0 0 8px', position: 'relative', display: 'inline-block' }}>
                                <div onClick={props.toggleMessage}>
                                    <CopyToClipboard
                                    text={props.groupObject.joinCode}
                                    onCopy={props.toggleMessage}
                                    >
                                        <Chip label="Click to copy invitation code" />
                                    </CopyToClipboard>
                                </div>
                                <MessageBox
                                color="black"
                                backgroundColor="#90ee90"
                                left="-110px"
                                top="32px"
                                position="absolute"
                                show={props.showCopyMessage}>
                                    <CheckCircleOutline style={{ margin: '0 16px 0 0' }} />
                                    Copied code to clipboard
                                </MessageBox>
                            </div>
                    </Typography>
                    {props.groupMembers.map(m => (
                        <UserInList
                        name={m.name}
                        imageUrl={m.imageUrl}
                        userId={m._id}
                        key={m._id}
                        groupObject={props.groupObject}
                        addAdminHandler={props.addAdminHandler}
                        groupMembers={props.groupMembers}
                        removeUserHandler={props.removeUserHandler}
                        removeAdminStatus={props.removeAdminStatus}
                        />
                    ))}
                </CardContent>
            </Card>
        </div>
    </Fragment>
);

export default aboutGroup;
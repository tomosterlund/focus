import React, { Fragment } from 'react'
import { Schedule, Event, Room, Settings } from '@material-ui/icons';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styles from './GroupEvents.module.scss'
import Fab from './../../../components/UI/Fab'
import { useSelector } from "react-redux";

const GroupMembers = (props) => {
    const sessionUser = useSelector(state => state.sessionUser);

    return(
        <Fragment>
            <div className="WhiteContainer">
                {props.events.map(e => {
                    return(
                        <Accordion style={{width: '100%'}} key={e.name}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>{e.name}</Typography>
                                {
                                    sessionUser._id === e.authorId ? (
                                        <div 
                                        className={styles.SettingsCog}
                                        onClick={() => props.editEvent(e._id)}
                                        >
                                            <Settings fontSize="small" />
                                        </div>
                                    ) : null
                                }
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <span className={styles.TimeStamp}>
                                        <Event />
                                        <div className={styles.InfoBox}>{e.date.substring(0, 10)}</div>
                                    </span>
                                    <span className={styles.TimeStamp}>
                                        <Schedule />
                                        <div className={styles.InfoBox}>{e.time}</div>
                                    </span>
                                    <span className={styles.TimeStamp}>
                                        <Room />
                                        <div className={styles.InfoBox}>{e.location}</div>
                                    </span>
                                    <div className={styles.TextBox}>
                                        {e.text}
                                    </div>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    )
                })}
            </div>
            <div className={styles.AddIconContainer}>
                <Fab click={props.click} />
            </div>
        </Fragment>
    );
};

export default GroupMembers;
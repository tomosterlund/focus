import React, { Component } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import defaultBG from './../GroupRoom/GroupRoom.module.scss'
import styles from './GroupsPage.module.scss'
import GroupSummary from './GroupSummary/GroupSummary'
import CircularProgress from '@material-ui/core/CircularProgress';

class GroupPage extends Component {
    state = {
        progressSpinner: false,
        userGroups: [],
        showPageContent: false
    }

    async componentDidMount() {
        try {
            const getGroups = await axios.get('/focusapi/groups/groups');
            this.setState({ userGroups: getGroups.data.userGroups });
            console.log(this.state.userGroups);
            this.setState({ showPageContent: true });
        } catch (error) {
            console.log(error)
        }
    }

    fetchGroup = (groupId) => {
        this.props.history.push(`/groups/${groupId}`);
    }

    render() {
        const groupSummaries = (
            <span style={{ width: '80%' }}>
                {this.state.userGroups.map(g => (
                    <GroupSummary click={this.fetchGroup} key={g._id} group={g} />
                ))}
            </span>
        )

        const noGroups = (
            <h2>You haven't joined any groups yet.</h2>
        )

        const spinner = <CircularProgress style={{ position: 'fixed', top: '45%', left: 'auto' }} />

        return(
            <span className={[defaultBG.GroupRoomContainer].join(' ')}>
                {
                    this.state.showPageContent ?  <span className={styles.GroupsPage}>
                        { this.state.userGroups[0] ? groupSummaries : noGroups }
                    </span> : spinner
                }
               
            </span>
        );
    }
}

export default withRouter(GroupPage);
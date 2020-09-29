import React from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const AppFab = (props) => (
    <Fab
    style={{ backgroundColor: '#05668d', color: 'white' }}
    aria-label="add"
    onClick={props.click}
    >
        <AddIcon />
    </Fab>
)

export default AppFab;
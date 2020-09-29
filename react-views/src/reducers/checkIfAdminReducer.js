const checkIfAdmin = (state = false, action) => {
    switch(action.type) {
        case 'ADMIN_TRUE':
            return true;
        case 'ADMIN_FALSE':
            return false;
        default:
            return state;
    }
}

export default checkIfAdmin;
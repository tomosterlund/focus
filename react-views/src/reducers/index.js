import sessionUser from './sessionReducer'
import checkIfAdmin from './checkIfAdminReducer'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    sessionUser,
    checkIfAdmin
})

export default rootReducer;
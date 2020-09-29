export const setSession = (payload) => {
    return {
        type: 'LOGIN',
        payload: payload
    }
}

export const setAdminStatus = () => {
    return {
        type: 'ADMIN_TRUE'
    }
}

export const setAdminStatusToFalse = () => {
    return {
        type: 'ADMIN_FALSE'
    }
}
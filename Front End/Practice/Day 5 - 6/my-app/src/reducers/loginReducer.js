const INITIAL_STATE = {
    id: null,
    username: '',
    password: '',
    role: ''
}

export const authReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case "LOGIN_SUCCESS":
            console.log('Data goto Reducer from loginAction: ', action)
            // return data from action
            return { ...state, ...action.payload } 
        default:
            return state
    }
}
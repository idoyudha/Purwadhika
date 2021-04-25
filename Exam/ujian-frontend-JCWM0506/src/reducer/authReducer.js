const INITIAL_STATE = {
    id: null,
    email: '',
    password: '',
    cart: []
}

export const authReducer = (state=INITIAL_STATE, action) => {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            console.log("data reducer", action.payload)
            delete action.payload.password
            return { ...state, ...action.payload}
        case "UPDATE_CART":
            return { ...state, cart: action.payload }
        case "LOGOUT":
            return INITIAL_STATE
        default:
            return state
    }
}
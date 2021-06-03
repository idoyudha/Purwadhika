const INITIAL_STATE = {
    iduser: null,
    username: '',
    email: '',
    role: '',
    status: '',
    cart: [],
    checkout: []
}

export const authReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            delete action.payload.password
            return { ...state, ...action.payload }
        case "UPDATE_CART":
            // console.log("reducer",action.payload)
            return { ...state, cart: action.payload }
        case "UPDATE_CHECKOUT":
            // console.log("reducer checkout",action.payload)
            return { ...state, checkout: action.payload }
        case "LOGOUT":
            return INITIAL_STATE
        default:
            return state
    }
}
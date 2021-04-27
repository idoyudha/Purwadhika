const INITIAL_STATE = {
    id: null,
    username: '',
    email: '',
    role: '',
    cart: [],
    loading: false
}

export const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "USER_LOGIN":
            delete action.payload.password
            return {
                ...state, ...action.payload, loading: false
            }
        case "UPDATE_CART":
            return {
                ...state, cart: action.payload
            }
        case "LOGOUT":
            return INITIAL_STATE
        case "LOADING":
            return { ...state, loading: true }
        default:
            return state
    }
}
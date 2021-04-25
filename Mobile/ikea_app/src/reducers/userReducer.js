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
            console.log("reducer data", action.payload)
            return {
                ...state, ...action.payload
            }
        case "UPDATE_CART":
            return {
                ...state, cart: action.payload
            }
        case "LOADING":
            return {...state, loading: true}
        default:
            return state
    }
}
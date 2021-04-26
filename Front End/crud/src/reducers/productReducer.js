const INITIAL_STATE = {
    product_data: []
}

export const productReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "GET_PRODUCTS":
            console.log("data reducer from action", action.payload)
            return {
                ...state, product_data: action.payload
            }
        case "UPDATE_PRODUCTS":
            console.log("data after update", action.payload)
            return {
                ...state, product_data: action.payload
            }
        default:
            return state
    }
}
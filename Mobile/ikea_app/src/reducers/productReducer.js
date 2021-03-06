const INITIAL_STATE = {
    product_list: []
}

export const productReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "DATA_PRODUCT":
            console.log("product update reducer", action.payload)
            return {
                ...state, product_list: action.payload
            }
        default:
            return state
    }
}
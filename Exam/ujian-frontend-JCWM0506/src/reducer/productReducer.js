const INITIAL_STATE = {
    product_list: []
}

export const productReducers = (state=INITIAL_STATE,action) => {
    switch (action.type) {
        case "GET_PRODUCTS":
            console.log("data products reducer", action.payload)
            return {...state, product_list: action.payload}
        default:
            return state;
    }
}
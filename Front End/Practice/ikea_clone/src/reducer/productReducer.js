const INITIAL_STATE = {
    product_list: [],
    product_sort: [],
}

export const productReducers = (state=INITIAL_STATE,action) => {
    switch (action.type) {
        case "GET_PRODUCTS":
            console.log("data reducer", action.payload)
            // spread operator ... 
            return {...state, product_list: action.payload, product_sort: action.payload}
        // case "SORT_PRODUCTS":
        //     return {...state, product_sort: action.payload}
        default:
            return state;
    }
}
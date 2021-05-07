const INITIAL_STATE = {
    products_list: [],
    products_sort: []
}

export const productReducers = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "GET_PRODUCTS":
            console.log("reducer", action.payload)
            return { ...state, products_list: action.payload, products_sort: action.payload }
        case "SORT_PRODUCTS":
            return { ...state, products_sort: action.payload }
        default:
            return state
    }
}
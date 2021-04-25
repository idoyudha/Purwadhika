const INITIAL_STATE = {
    product_cart: []
}

export const cartReducers = (state=INITIAL_STATE,action) => {
    switch (action.type) {
        case "CART":
            console.log("cart reducer", action.payload)
            return {...state, product_cart: action.payload}
        case "UPDATE CART":
            return {...state, product_cart: action.payload}
        default:
            return state;
    }
}
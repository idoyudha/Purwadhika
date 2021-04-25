const INITIAL_STATE = {
    order_summary: []
}

export const orderReducers = (state=INITIAL_STATE,action) => {
    switch (action.type) {
        case "ORDER SUMMARY":
            console.log("order summary reducer", action.payload)
            return {...state, order_summary: action.payload}
        default:
            return state;
    }
}
export const cartProducts = (data) => {
    return {
        type: "CART",
        payload: data
    }
}

export const updateCart = (data) => {
    return {
        type: "UPDATE CART",
        payload: data
    }
}
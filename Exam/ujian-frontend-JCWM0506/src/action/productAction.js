export const getProductAction = (data) => {
    console.log('Product Data goto Action from component', data)
    return {
        type: "GET_PRODUCTS",
        payload: data
    }
}
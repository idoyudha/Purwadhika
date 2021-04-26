import axios from "axios"

export const getProductAction = () => {
    return (dispatch) => {
        axios.get(`http://localhost:2020/products`)
        .then(response => {
            console.log('Data product', response.data)
            dispatch({
                type: "GET_PRODUCTS",
                payload: response.data
            })
        })
        .catch(error => {
            console.log('Error get product',error)
        })
    }
}

export const getDataProduct = (data) => {
    console.log('Product Data goto Action from component', data)
    return {
        type: "GET_PRODUCTS",
        payload: data
    }
}

export const updateProductAction = (data) => {
    console.log('Update Action', data)
    return {
        type: "UPDATE_PRODUCTS",
        payload: data
    }
}
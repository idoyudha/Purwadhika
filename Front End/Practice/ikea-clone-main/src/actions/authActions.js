import axios from "axios"
import { URL_API } from "../helper"

export const authLogin = (email, password) => {
    return async (dispatch) => {
        try {
            let response = await axios.post(URL_API + `/users/login`, {
                email, password
            })
            // console.log('Response data', response.data[0])
            localStorage.setItem("tkn_id", response.data.token)
            console.log('token id in action', localStorage.getItem("tkn_id"))
            await dispatch(getCart(response.data.token))
            dispatch({
                type: "LOGIN_SUCCESS",
                payload: { ...response.data}
            })
        } 
        catch (error) {
            console.log(error)
        }
    }
}

export const getCart = (token) => {
    return async (dispatch) => {
        try {
            console.log("Response data before add cart", token)
            let config = {
                method: 'get',
                url: URL_API + `/transaction/cart/${token}`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            let response = await axios(config)
            console.log("Response data after add cart", response)
            dispatch({
                type: "UPDATE_CART",
                payload: response.data
            })
        } 
        catch (error) {
            console.log(error)
        }
    }
}

export const authLogout = () => {
    localStorage.removeItem('tkn_id')
    return {
        type: "LOGOUT"
    }
}

export const keepLogin = (data) => {
    return async (dispatch) => {
        try {
            localStorage.setItem("tkn_id", data.token)
            await dispatch(getCart(data.token))
            await dispatch(getDataTransaction(data.token))
            // console.log("cart2", cart)
            dispatch({
                type: "LOGIN_SUCCESS",
                payload: { ...data }
            })
        } 
        catch (error) {
            console.log(error)
        }
    }
}

// export const updateCart = (data) => {
export const updateCart = (data, index) => {
    // console.log("Update cart", data, index)
    let idcart = data[index].idcart
    let quantity = data[index].quantity
    axios.patch(URL_API + `/transaction/update-cart`, {
        idcart, quantity
    })
    .then(res => {
        // console.log("Update cart database", res.data)
    })
    .catch(err => {
        console.log(err)
    })
    return {
        type: "UPDATE_CART",
        payload: data
    }
}

export const getDataTransaction = () => {
    return (dispatch) => {
        let token = localStorage.getItem("tkn_id")
        // console.log('token', token)
        let config = {
            method: 'get',
            url: URL_API + `/transaction/payment/${token}`,
            headers: {
              Authorization: `Bearer ${token}`
            }
        }
        axios(config)
        .then(response => {
            // mengarahkan data ke reducer
            dispatch({
                type: "UPDATE_CHECKOUT",
                payload: response.data
            })
        }).catch(err => {
            console.log(err)
        })
    }
}
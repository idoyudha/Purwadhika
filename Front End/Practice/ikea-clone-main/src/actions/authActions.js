import axios from "axios"
import { URL_API } from "../helper"

export const authLogin = (email, password) => {
    return async (dispatch) => {
        try {
            let response = await axios.post(URL_API + `/users/login`, {
                email, password
            })
            localStorage.setItem("tkn_id", response.data[0].iduser)
            await dispatch(getCart(response.data[0].iduser))
            dispatch({
                type: "LOGIN_SUCCESS",
                payload: { ...response.data[0]}
            })
        } 
        catch (error) {
            console.log(error)
        }
    }
}

export const getCart = (id) => {
    return async (dispatch) => {
        try {
            let response = await axios.get(URL_API + `/transaction/cart/${id}`)
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
            await dispatch(getCart(data.iduser))
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

// export const getDataTransaction = () => {
//     return async (dispatch) => {
//         try {
//             let idToken = localStorage.getItem("tkn_id")
//             let response = axios.get(URL_API + `/transaction/payment/${idToken}`)
//             console.log('Response Transaction', response)
//             dispatch({
//                 type: "UPDATE_CHECKOUT",
//                 payload: response.data
//             })
//         } 
//         catch (error) {
//             console.log(error)
//         }
//     }
// }

export const getDataTransaction = () => {
    return (dispatch) => {
        let idToken = localStorage.getItem("tkn_id")
        axios.get(URL_API + `/transaction/payment/${idToken}`)
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
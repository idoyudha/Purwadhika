import axios from "axios"
import { URL_API } from "../helper"

export const authLogin = (email, password) => {
    return async (dispatch) => {
        // try {
        //     let res = await axios.post(URL_API + `users/login`, {
        //         email, password
        //     })
        //     console.log('Response data', res.data)
        //     localStorage.setItem("tkn_id", res.data[0].iduser)
        //     // menyimpan data ke reducer
        //     dispatch(getCart(res.data[0].iduser))
        //     dispatch({
        //         type: "LOGIN_SUCCESS",
        //         payload: res.data[0]
        //     })
        // } catch (error) {
        //     console.log(err)
        // }
        // fungsi untuk get data ke API
        axios.post(URL_API + `/users/login`, {
            email, password
        })
        .then(res => {
            console.log('Response data', res.data)
            localStorage.setItem("tkn_id", res.data[0].iduser)
            // menyimpan data ke reducer
            // dispatch(getCart(res.data[0].iduser))
            axios.get(URL_API + `/users?iduser=${res.data[0].iduser}`)
            .then(res => {
                console.log("RESPONSE DATA DOUBLE", res.data)
                dispatch({
                    type: "LOGIN_SUCCESS",
                    payload: res.data[0]
                })
            })
            .catch(err => {
                console.log(err)
            })
        }).catch(err => {
            console.log(err)
        })
    }
}

export const getCart = (id) => {
    axios.get(URL_API + `/transaction/get-cart/${id}`)
    .then(response => {
        console.log("cart user", response.data)
    })
    .catch(error => {
        console.log(error)
    })
}

export const authLogout = () => {
    localStorage.removeItem('tkn_id')
    return {
        type: "LOGOUT"
    }
}

export const keepLogin = (data) => {
    return {
        type: "LOGIN_SUCCESS",
        payload: data
    }
}

// export const updateCart = (data) => {
export const updateCart = (data, index) => {
    console.log("Update cart", data, index)
    let idcart = data[index].idcart
    let quantity = data[index].quantity
    axios.patch(URL_API + `/transaction/update-cart`, {
        idcart, quantity
    })
    .then(res => {
        console.log("Update cart database", res.data)
    })
    .catch(err => {
        console.log(err)
    })
    return {
        type: "UPDATE_CART",
        payload: data
    }
}
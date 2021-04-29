import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { URL_API } from "../helper"

export const getUsers = () => {
    return (dispatch) => {
        axios.get(URL_API + `/users`)
            .then(res => {
                console.log("Get users :", res.data)
            }).catch(err => {
                console.log("Error get users :", err)
            })
    }
}

export const onLogin = (username, password) => {
    return (dispatch) => {
        console.log('Data action :', username, password)
        axios.get(URL_API + `/users?username=${username}&password=${password}`)
            .then(res => {
                if (res.data.length > 0) {
                    // mengirim data ke reducer
                    console.log("Data login", res.data[0])
                    dispatch({
                        type: "USER_LOGIN",
                        payload: res.data[0]
                    })
                    AsyncStorage.setItem("id_tkn", `${res.data[0].id}`)
                }
            }).catch(err => {
                console.log(err)
            })
    }
}

export const onKeepLogin = () => {
    return async (dispatch) => {
        try {
            let tkn = await AsyncStorage.getItem("id_tkn")
            console.log('cek keeplogin', tkn)
            let res = await axios.get(URL_API + `/users?id=${tkn}`)
            if (res.data.length > 0) {
                // mengirim data ke reducer
                console.log("Data keep login", res.data[0])
                dispatch({
                    type: "USER_LOGIN",
                    payload: res.data[0]
                })
                AsyncStorage.setItem("id_tkn", `${res.data[0].id}`)
            }
        } catch (error) {
            console.log(err)
        }
    }
}

export const onRegis = (username, email, password, confpassword) => {
    return (dispatch) => {
        axios.post(URL_API + `/users`, {
            username,
            email,
            password,
            role: 'user'
        }).then(resPost => {
            // alert("regis success")
            console.log(resPost.data)
            // jika sudah ada id, maka redirect ke home atau auto login
            if (resPost.data.id) {
                dispatch({
                    type: "USER_LOGIN",
                    payload: resPost.data
                })
                AsyncStorage.setItem("id_tkn", `${resPost.data.id}`)
            }
        }).catch(errPost => {
            console.log(errPost)
        })
    }
}

export const updateCart = (data) => {
    return {
        type: "UPDATE_CART",
        payload: data
    }
}

export const authLogout = () => {
    console.log('Logout Action')
    return (dispatch) => {
        AsyncStorage.removeItem("id_tkn")
        dispatch({
            type: "LOGOUT"
        })
    }
}
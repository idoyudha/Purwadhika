import axios from "axios"
import { URL_API } from "../helper"

export const getProducts = () => {
    return async (dispatch) => {
        // try {
        //     let get = await axios.get(URL_API + `/products`)
        //     dispatch({
        //         type: "DATA_PRODUCT",
        //         payload: response.data
        //     })
        // }
        // catch (error) {
        //     console.log(error)
        // }
        axios.get(URL_API + `/products`)
        .then(response => {
            console.log("products ==>", response.data)
            dispatch({
                type: "DATA_PRODUCT",
                payload: response.data
            })
        }).catch(error => {
            console.log(error)
        })
    }     
}
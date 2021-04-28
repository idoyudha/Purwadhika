import axios from "axios"
import { URL_API } from "../helper"

export const getProducts = () => {
    return (dispatch) => {
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
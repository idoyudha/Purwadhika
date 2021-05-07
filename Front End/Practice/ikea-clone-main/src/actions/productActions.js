// redux default
// export const getProductAction = (data) => {
//     return {
//         type: "GET_PRODUCTS",
//         payload: data
//     }
// }

import axios from "axios"
import { URL_API } from "../helper"

// redux-thunk
export const getProductAction = (field="id",sortType="asc") => {
    return (dispatch) => {
        axios.get(URL_API + `/products`)
            .then(res => {
                // mengarahkan data ke reducer
                dispatch({
                    type: "GET_PRODUCTS",
                    payload: res.data
                })
            }).catch(err => {
                console.log(err)
            })
    }
}

export const sortProducts = (data) => {
    return {
        type: "SORT_PRODUCTS",
        payload: data
    }
}


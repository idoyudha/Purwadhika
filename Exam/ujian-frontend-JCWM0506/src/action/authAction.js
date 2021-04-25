export const authLogin = (data) => {
    console.log('Login Data goto Action from component', data)
    return {
        type: 'LOGIN_SUCCESS',
        payload: data
    }
}

export const keepLogin = (data) => {
    console.log('KeepLogin Data goto Action from component', data)
    return {
        type: 'LOGIN_SUCCESS',
        payload: data
    }
}

export const authLogout = () => {
    localStorage.removeItem('tkn_id')
    return {
        type: 'LOGOUT',
    }
}

export const updateCart = (data) => {
    console.log("cart qty",data)
    return {
        type: "UPDATE_CART",
        payload: data
    }
}
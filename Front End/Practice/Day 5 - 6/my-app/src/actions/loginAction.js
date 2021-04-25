// function for return data from component to reducer
export const authLogin = (data) => {
    console.log('Data goto Action from component: ', data)
    return {
        type: 'LOGIN_SUCCESS',
        payload: data
    }
}
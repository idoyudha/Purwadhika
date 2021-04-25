// function for return data from component to reducer
export const cardQuery = (data) => {
    console.log('Data goto Action from component: ', data)
    return {
        type: 'CARD_DATA',
        payload: data
    }
}
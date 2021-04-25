export const orderSummary = (data) => {
    console.log('Summary goto Action from component', data)
    return {
        type: "ORDER SUMMARY",
        payload: data
    }
}
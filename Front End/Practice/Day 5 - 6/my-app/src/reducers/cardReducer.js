const INITIAL_STATE = {
    dataAlbum: []
}

export const dataReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case "CARD_DATA":
            console.log('Data goto Reducer from cardAction: ', action)
            // return data from action
            return { ...state, dataAlbum: action.payload } 
        default:
            return state
    }
}
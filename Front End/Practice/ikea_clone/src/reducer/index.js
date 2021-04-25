import { combineReducers } from 'redux'
import { authReducer } from './authReducer'
import { productReducers } from './productReducer'
import { cartReducers } from './cartReducer'
import { orderReducers } from './summaryReducer'

export const Reducers = combineReducers({
    authReducer,
    productReducers,
    cartReducers,
    orderReducers
})
import { combineReducers } from 'redux'
import { authReducer } from './authReducer'
import { productReducers } from './productReducers'

export const Reducers = combineReducers({
    authReducer,
    productReducers
})
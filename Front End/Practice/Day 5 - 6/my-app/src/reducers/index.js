import { combineReducers } from 'redux'
import { authReducer } from'./loginReducer'
import { dataReducer } from'./cardReducer'

export const Reducers = combineReducers({ authReducer, dataReducer })


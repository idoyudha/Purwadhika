import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'
import { Reducers } from './reducers';
import ReduxThunk from 'redux-thunk'

const globalStore = createStore(Reducers, {}, applyMiddleware(ReduxThunk));
ReactDOM.render(
  <Provider store={globalStore}>
    {/* 1.config react-routerdom */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

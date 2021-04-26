import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Reducers } from './reducers';
import ReduxThunk from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';

const globalStore = createStore(Reducers, {}, applyMiddleware(ReduxThunk));

ReactDOM.render(
  <Provider store={globalStore}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);


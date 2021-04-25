import logo from './logo.svg';
import './App.css';
import AuthPage from './pages/authPage'
import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import axios from 'axios';
import { connect } from 'react-redux';
import HomePage from './pages/homePage';
import NotFound from './pages/notfoundPage';
import NavbarComp from './components/navbar';
import { URL_API } from './helper';
import { authLogin } from './action';
import { getProductAction } from './action';
import CartPage from './pages/cartPage';
import CheckoutPage from './pages/checkoutPage';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }

  componentDidMount() {
    this.reLogin()
    this.getProducts()
  }

  reLogin = () => {
    let idToken = localStorage.getItem("tkn_id")
    console.log('idToken', idToken)
    axios.get(URL_API+`/users?id=${idToken}`)
    .then(response => {
      console.log('relogin', response.data)
      this.props.authLogin(response.data[0])
    })
    .catch(error => {
      console.log(error)
    })
  }

  getProducts() {
    axios.get(URL_API+`/products`)
    .then(response => {
        console.log("product list", response.data)
        this.props.getProductAction(response.data)
    })
    .catch(error => {
        console.log(error)
    })
  }

  render() { 
    return (  
      <div>
        <NavbarComp/>
        <Switch>
          <Route path="/login" component={AuthPage}/>
          <Route path="/cart" component={CartPage}/>
          <Route path="/checkout" component={CheckoutPage}/>
          <Route path="/" component={HomePage} exact/>
          <Route path="*" component={ NotFound }/>
        </Switch>
      </div>
    );
  }
}
 
export default connect(null, {authLogin, getProductAction})(App);

import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, InputGroup } from 'reactstrap';
import axios from 'axios';
import { URL_API } from '../helper';
import { connect } from 'react-redux';
import { authLogin } from '../action';
import { Redirect } from 'react-router-dom';


class AuthenticationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            char: 'red',
            word: 'red',
            number: 'red',
            login: false
        }
    }

    passValidation = () => {
        let wordR = /[A-Za-z]/g
        let numberR = /[0-9]/g
        let password = this.inPassword.value
        let l = this.inPassword.value.length
        let c = this.refs.char.textContent
        let n = this.refs.number.textContent
        console.log('char',l, c, n, password)
        let wordVal = password.match(wordR)
        let numberVal = password.match(numberR)
        if (wordVal) {
            this.setState({word: 'green'})
        }
        else {
            this.setState({word: 'black'})
        }
        if (numberVal) {
            this.setState({number: 'green'})
        }
        else {
            this.setState({number: 'black'})
        }
        if (l > 5) {
            this.setState({char: 'green'})
        }
        else {
            this.setState({char: 'black'})
        }
        if (wordVal && numberVal && l > 5) {
            this.setState({login: true})
        }
    }

    userLogin = () => {
        let email = this.inEmail.value
        let password = this.inPassword.value
        if (this.state.login) {
            console.log('Pass valid')
            let cart = []
            console.log(email, password)
            axios.get(URL_API+`/users?email=${email}`)
            .then(response => {
                console.log('response login', response.data)
                localStorage.setItem('tkn_id', response.data[0].id)
                if (response.data.length > 0) {
                    console.log("Email already exist!")
                    this.props.authLogin(response.data[0])
                }
                else {
                    axios.post(URL_API+`/users`, {
                        email,
                        password,
                        cart
                    })
                    .then(response => {
                        console.log(response.data)
                    })
                    .catch(error => {
                        console.log(error)
                    })
                }
                
            })
            .catch(error => {
                console.log(error)
            })
        }
        else {
            alert('Password not valid')
        }
        
    }

    render() { 
        console.log("authpage", this.props.id > 0)
        if (this.props.id > 0) {
            return <Redirect to="/" />
        }
        return (  
            <div className="container">
                <h1 className="text-center my-4">User Login and Logout</h1>
                <Form>
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Input type="email" name="email" innerRef={el => this.inEmail = el} placeholder="Enter your email address ..." />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <InputGroup>
                            <Input type={this.state.passType} type="password" name="password" innerRef={el => this.inPassword = el} placeholder="Enter your password ..." onChange={this.passValidation}/>
                        </InputGroup>
                        <div>
                            <p>Password must be containing the following:</p>
                            <ul>
                                <li ref="char" style={{color: this.state.char}}>6 character</li>
                                <li ref="word" style={{color: this.state.word}}>Include word</li>
                                <li ref="number" style={{color: this.state.number}}>Include number</li>
                            </ul>
                        </div>
                    </FormGroup>
                    <button type="button" onClick={this.userLogin} class="btn btn-primary btn-lg btn-block my-3">Login</button>
                </Form>
            </div>
        );
    }
}

const mapStateToProps = ({authReducer}) => {
    return {
        ...authReducer
    }
}

export default connect(mapStateToProps, {authLogin})(AuthenticationPage);
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { URL_API } from '../helper';
import axios from 'axios';
import { updateCart } from '../action/authAction'
import { Link } from 'react-router-dom';
import { Modal, Input, Button, ModalHeader, ModalBody, ModalFooter, Table, Toast, ToastBody, ToastHeader } from 'reactstrap';

class CartPage extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            data: this.props.product_list
        }
    }

    toggle = () => {
        console.log('toggle')
        this.setState({ modal: !this.state.modal })
    }

    delete = (id) => {
        this.props.cart.splice(id, 1)
        axios.patch(URL_API + `/users/${this.props.id}`, { cart: this.props.cart })
            .then(response => {
                this.props.updateCart([...this.props.cart])
            }).catch(err => {
                console.log(err)
            })
    } 

    removeQty = (index) => {
        let id = localStorage.getItem('tkn_id')
        this.props.updateCart([...this.props.cart])
        let cart = this.props.cart
        let cartEdit = this.props.cart[index]
        if (cartEdit.qty > 1) {
            cartEdit.qty -= 1
            axios.patch(URL_API+`/users/${id}`, {
                cart
            })
            .then(response => {
                console.log(response.data)
            })
            .catch(error => {
                console.log("Error", error)
            })    
        }
    }

    addQty = (index) => {
        let product = this.props.product_list
        let id = localStorage.getItem('tkn_id')
        this.props.updateCart([...this.props.cart])
        let cart = this.props.cart
        let cartEdit = this.props.cart[index]
        let indexFound = product.findIndex(item => item.name === cartEdit.name)
        console.log('index', indexFound)
        console.log('Product stock', product[indexFound].stock)
        if (product[indexFound].stock > this.props.cart[index].qty) {
            cartEdit.qty += 1
            axios.patch(URL_API+`/users/${id}`, {
                cart
            })
            .then(response => {
                console.log(response.data)
            })
            .catch(error => {
                console.log("Error", error)
            })          
        }
        else {
            alert('Stock is not enough')
        }
    }
    
    printTable = () => {
        let cart = this.props.cart
        console.log(cart)
        return cart.map((item, index) => {
            return  <tr>
                        <th>{index+1}</th>
                        <td>{item.name}</td>
                        <td>
                            <span style={{display: 'flex', alignItems:'center'}}>
                                <Button outline size="sm" onClick={() => this.removeQty(index)}>remove</Button>
                                <Input className="text-center" placeholder='qty' value={item.qty} style={{width: '50%', display:'inline-block'}} />
                                <Button outline size="sm" color="primary" onClick={() => this.addQty(index)}>add</Button>
                            </span>
                        </td>
                        <td>IDR {item.subtotal}</td>
                        <td><Button outline color="danger" onClick={() => this.delete(index)} className="d-flex flex-column align-items-center" size="sm">Delete</Button></td>
                    </tr>
        })
    }

    checkOut = () => {
        console.log('checkout', this.props.cart)
        let user_id = localStorage.getItem('tkn_id')
        let email = this.props.email
        let cart = this.props.cart 
        let status = 'UNPAID'
        console.log(user_id, email, cart)
        axios.post(URL_API+`/userTransactions`, {
            user_id, email, cart, status
        })
        .then(response => {
            console.log('Response after post', response)
        })
        .catch(error => {
            console.log(error)
        })
    }

    render() {
        console.log('PROPS', this.props.product_list)
        return (  
            <div className="container">
                <h1 className="text-center my-4">User Cart</h1>
                <div>
                <Table>
                    <thead>
                        <tr>
                        <th>No</th>
                        <th>Product Name</th>
                        <th>Amount</th>
                        <th>Subtotal</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.printTable()}
                    </tbody>
                </Table>
                </div>
                <Button color="warning" block onClick={this.toggle}>Check out</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} style={{width: '70%'}}>
                <ModalHeader toggle={this.toggle} charCode="x">User Confirmation</ModalHeader>
                <ModalBody>
                <p>Will pay after this</p>
                </ModalBody>
                <ModalFooter className="d-flex justify-content-between">
                    <Button className="d-flex justify-content-center" outline color="secondary" onClick={this.toggle}>Continue Shopping</Button>
                    <Link to="/checkout" style={{textDecoration: 'none'}}>
                        <Button onClick={this.checkOut} className="d-flex justify-content-center" color="success">Go to shopping cart</Button>{' '}
                    </Link>
                </ModalFooter>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = ({ authReducer, productReducers }) => {
    return {
        ...authReducer,
        ...productReducers
    }
} 

export default connect(mapStateToProps, {updateCart}) (CartPage);
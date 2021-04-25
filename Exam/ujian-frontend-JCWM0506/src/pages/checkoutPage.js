import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { URL_API } from '../helper';
import { orderSummary } from '../action/transactionAction';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class CheckoutPage extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    componentDidMount() {
        this.getData()
    }

    getData = () => {
        let id = parseInt(localStorage.getItem('tkn_id'))
        console.log(id)
        axios.get(URL_API+`/userTransactions?user_id=${id}`)
        .then(response => {
            console.log('Response get data', response.data[0])
            this.props.orderSummary(response.data[0])
        })
        .catch(error => {
            console.log(error)
        })
    }

    toggle = () => {
        this.setState({ modal: !this.state.modal })
    }

    printModal = () => {
        console.log('Modal', this.props)
        let cart = this.props.order_summary.cart
        return cart.map((item, index) => {
            return  <tr>
                        <td>{item.name}</td>
                        <td>{item.qty}</td>
                        <td>IDR {item.subtotal}</td>
                    </tr>
        })
    }

    payOrder = () => {
        let id = localStorage.getItem('tkn_id')
        if (this.pay.textContent == "PAID") {
            this.pay.textContent = "UNPAID"
            this.pay.style.backgroundColor = "red"
            this.props.order_summary.status = "PAID"
            axios.get(URL_API+`/userTransactions`)
            .then(response => {
                console.log(response.data)
                let index = response.data.findIndex(item => item.user_id === id)
                console.log('Index', index)
                if (index > -1) {
                    axios.patch(URL_API+`/userTransactions/${index+1}`, {
                        status : "PAID"
                    })
                    .then(response => {
                        console.log('Response get data', response.data)
                        this.props.orderSummary(response.data)
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
            this.pay.textContent = "PAID"
            this.pay.style.backgroundColor = "green"
            this.props.order_summary.status = "UNPAID"
            axios.get(URL_API+`/userTransactions`)
            .then(response => {
                console.log(response.data)
                let index = response.data.findIndex(item => item.user_id === id)
                console.log('Index', index)
                if (index > -1) {
                    axios.patch(URL_API+`/userTransactions/${index+1}`, {
                        status : "UNPAID"
                    })
                    .then(response => {
                        console.log('Response get data', response.data)
                        this.props.orderSummary(response.data)
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
    }

    printData = () => {
        let order = this.props.order_summary
        console.log('order summary', order)
        if (order != []) {
            return  <tr>
                        <td>{order.email}</td>
                        <td>{order.status}</td>
                        <td>
                            <Button color="primary" onClick={this.toggle}>Detail</Button>
                            <Modal size="lg" isOpen={this.state.modal} toggle={this.toggle} style={{width: '70%'}}>
                            <ModalHeader toggle={this.toggle} charCode="x">Detail order transaction</ModalHeader>
                            <ModalBody>
                            <Table>
                                <thead>
                                    <tr>
                                    <th>Name</th>
                                    <th>Qty</th>
                                    <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody> 
                                    {/* {this.printModal()} */}
                                </tbody>
                            </Table>
                            </ModalBody>
                            <ModalFooter className="d-flex justify-content-between">
                                <Button className="d-flex justify-content-center" outline color="secondary" onClick={this.toggle}>Back to transaction</Button>
                            </ModalFooter>
                            </Modal>
                        </td>
                        <td><Button onClick={this.payOrder} color="success" innerRef={el => this.pay = el}>PAY!</Button></td>
                    </tr>
        }
    }

    render() { 
        console.log('user auth', this.props)
        return (  
            <div>
                <h1 className="text-center my-4">
                    Checkout User
                </h1>
                <div>
                <Table>
                <thead>
                    <tr>
                    <th>Email</th>
                    <th>Payment Status</th>
                    <th>Products Detail</th>
                    <th>Payment Action</th>
                    </tr>
                </thead>
                <tbody>
                    {this.printData()}
                </tbody>
                </Table>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ authReducer, orderReducers }) => {
    return {
        ...authReducer,
        ...orderReducers
    }
} 

export default connect(mapStateToProps, {orderSummary})(CheckoutPage);
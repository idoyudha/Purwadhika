import React, { Component } from 'react';
import { URL_API } from '../helper';
import axios from 'axios';
import { connect } from 'react-redux';
import { getProductAction } from '../action/productAction'
import { Link, Redirect } from 'react-router-dom';
import { updateCart } from '../action/authAction'
import {
    Card, CardImg, CardText, CardBody, Modal, Input, Toast, ToastBody, ToastHeader,
    CardTitle, CardSubtitle, Button, ModalHeader, ModalBody, ModalFooter
  } from 'reactstrap';


class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            modal: false,
            count: 1,
            redirect: false,
            toast: false,
            addProduct: []
        }
    }

    componentDidMount() {
        this.getProducts()
    }

    getProducts() {
        axios.get(URL_API+`/products`)
        .then(response => {
            // console.log("product list", response.data)
            this.props.getProductAction(response.data)
        })
        .catch(error => {
            console.log(error)
        })
    }

    toggle = (item) => {
        if (this.props.id === null) {
            alert('Login first')
            this.setState({redirect: true})
        }
        else if (item === undefined) {
            this.setState({ modal: !this.state.modal })
        }
        else {
            this.setState({ modal: !this.state.modal })
            this.setState({ addProduct: item })
        }
    }

    add = (index) => {
        if (this.state.count < this.props.product_list[index].stock) {
            this.setState(state => ({
                count: state.count + 1
            }))
        }
        else {
            alert('Stock not enough')
        }
    }

    remove = () => {
        if (this.state.count > 1 ) {
            this.setState({count: this.state.count - 1})
        }
    }

    addtoCart = (name, img, price) => {
        let userID = this.props.id
        let qty = this.state.count
        let subtotal = qty * price
        // console.log('Add to Cart', userID, name, img, qty, subtotal)
        let cart = this.props.cart
        let index = cart.findIndex(item => item.name === name)
        // console.log('Findindex', index)
        if (index > -1) {
            cart[index].qty += qty
        }
        else {
            cart.push({
                name, img, qty, subtotal
            })
        }
        axios.patch(URL_API+`/users/${userID}`, {
            cart: this.props.cart
        })
        .then(response => {
            console.log(response.data)
            setTimeout(() => this.setState({ toast: !this.state.toast, addProduct: {} }), 2000)
            this.props.updateCart([...cart])
        })
        .catch(error => {
            console.log("Error", error)
        })
        this.toggle()
    }

    printCard() {
        return this.props.product_list.map((item, index) => {
            return  <div className="col-md-3 col-6">
                    <Card>
                        <CardImg width="100" src={item.img} alt="Card image cap" />
                        <CardBody>
                        <CardTitle tag="h5">{item.name}</CardTitle>
                        <CardSubtitle tag="h6" className="mb-2 text-muted">Price: IDR {item.price}</CardSubtitle>
                        <CardSubtitle tag="h6" className="mb-2 text-muted">Stock: {item.stock}</CardSubtitle>
                            <Button color="warning" block onClick={() => this.toggle(item)}>Add to cart</Button>
                        </CardBody>
                    </Card>
                    </div>
        })
    }

    render() { 
        console.log("props cart", this.props.cart)
        if (this.state.redirect == true) {
            return <Redirect to="/login" />
        }
        return (  
            <div className="container-fluid">
                <h1>Homepage</h1>
                <div>
                <Modal size="lg" isOpen={this.state.modal} toggle={this.toggle} style={{width: '70%'}}>
                    <ModalHeader toggle={this.toggle} charCode="x">Add {this.state.addProduct.name} to cart, define quantity</ModalHeader>
                    <ModalBody>
                    <div className="d-flex justify-content-between align-items-center">
                    <img src={this.state.addProduct.img} style={{maxWidth: '100px'}}></img>
                    <span>Total qty:</span>
                        <span style={{width: '30%', display: 'flex', alignItems:'center'}}>
                            <Button outline size="sm" onClick={() => this.remove(this.state.addProduct.id)}>remove</Button>
                            <Input className="text-center" placeholder='qty' value={this.state.count} style={{width: '50%', display:'inline-block'}} />
                            <Button outline size="sm" color="primary" onClick={() => this.add(this.state.addProduct.id)}>add</Button>
                        </span>
                    </div>
                    </ModalBody>
                    <ModalFooter className="d-flex justify-content-between">
                        <Button className="d-flex justify-content-center" outline color="secondary" onClick={this.toggle}>Continue Shopping</Button>
                        <Button className="d-flex justify-content-center" color="warning" onClick={() => this.addtoCart(this.state.addProduct.name, this.state.addProduct.img, this.state.addProduct.price)}>Add to shopping cart</Button>{' '}
                    </ModalFooter>
                </Modal>
                <Toast isOpen={this.state.toast}>
                    <ToastHeader icon="success">
                        Successfully adding to cart
                    </ToastHeader>
                    <ToastBody>
                        Just one step closer!
                    </ToastBody>
                </Toast>
                </div>
                <div className="row">
                    {this.printCard()}
                </div>
                
            </div>
        );
    }
}

const mapStateToProps = ({ productReducers, authReducer }) => {
    return {
        ...productReducers,
        ...authReducer
    }
} 

export default connect(mapStateToProps, {getProductAction, updateCart})(HomePage);
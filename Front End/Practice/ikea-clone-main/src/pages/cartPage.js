import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { Button, Input } from 'reactstrap';
import { updateCart, getCart, getDataTransaction } from '../actions'
import { URL_API } from '../helper';
import { Link } from 'react-router-dom';
class CartPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    printCart = () => {
        // console.log("Props CART", this.props.cart)
        return this.props.cart.map((item, index) => {
            return <div className="row">
                <div className="col-md-2">
                    <img src={item.images} width="100%" />
                </div>
                <div className="col-md-6">
                    <h5 style={{ fontWeight: 'bolder' }}>{item.name}</h5>
                    <h5 style={{ fontWeight: 'bolder' }}>{item.type}</h5>
                    <h4 style={{ fontWeight: 'bolder' }}>Rp {item.price.toLocaleString()}</h4>
                </div>
                <div className="col-md-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex">
                            <span style={{ width: '50%', display: 'flex', alignItems: 'center' }}>
                                <span className="material-icons" style={{ cursor: 'pointer' }} onClick={() => this.onBtDec(index)}>
                                    remove
                                    </span>
                                <Input size="sm" placeholder="qty" value={item.quantity} style={{ width: "50%", display: 'inline-block' }} />
                                <span className="material-icons" style={{ cursor: 'pointer' }} onClick={() => this.onBtInc(index)}>
                                    add
                            </span>
                            </span>
                        </div>
                        {/* <h4>Rp {item.subTotal.toLocaleString()}</h4> */}
                    </div>
                    <Button outline color="warning" style={{ border: 'none', float: 'right' }} onClick={() => this.onBtRemove(index)}>Remove</Button>
                </div>
            </div>
        })
    }

    onBtRemove = (index) => {
        let idcart = this.props.cart[index].idcart 
        console.log('props', this.props)
        console.log('index delete idcart', idcart)
        axios.delete(URL_API + `/transaction/delete-cart/${idcart}`)
        .then(response => {
            this.props.cart.splice(index, 1)
            this.props.updateCart([...this.props.cart])
        }).catch(error => {
            console.log(error)
        })
    }

    onBtInc = (index) => {
        console.log('props', this.props)
        console.log(index)
        this.props.cart[index].quantity += 1
        this.props.updateCart([...this.props.cart], index)
        // axios.patch
    }

    onBtDec = (index) => {
        console.log(index)
        this.props.cart[index].quantity -= 1
        this.props.updateCart([...this.props.cart], index)
        if (this.props.cart[index].quantity == 0) {
            this.props.cart.splice(index, 1)
            this.onBtRemove(index)
        }
    }

    onBtCheckOut = () => {
        let iduser = localStorage.getItem("tkn_id")
        let cart = [] 
        this.props.cart.forEach(element => {
            cart.push(element)
        });
        console.log('CHECKOUT CART', cart)
        axios.post(URL_API + `/transaction/payment/${iduser}`, this.props.cart)
        .then(response => {
            console.log(response.data)
            this.props.getCart(iduser)
            this.props.getDataTransaction()    
        })
        .catch(error => {
            console.log(error)
        })
    }   

    render() {
        // console.log('PROPS', this.props)
        return (
            <div>
                <h1 className="text-center mt-5">CART</h1>
                <p className="text-center">delete function bug, need to refresh</p>
                <div className="mt-5">
                    {this.printCart()}
                </div>
                <Link to="/checkout" className="nav-link" style={{ color: '#2c3e50', fontWeight: 'bold' }}>
                    <Button type="button" onClick={this.onBtCheckOut}>Checkout</Button> 
                </Link>
            </div>
        );
    }
}

const mapToProps = ({ authReducer, productReducers }) => {
    return {
        ...authReducer, products: productReducers.products_list
    }
}

export default connect(mapToProps, { updateCart, getCart, getDataTransaction })(CartPage);
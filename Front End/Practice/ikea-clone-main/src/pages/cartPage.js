import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { Button, Input } from 'reactstrap';
import { updateCart } from '../actions'
import { URL_API } from '../helper';
class CartPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    printCart = () => {
        return this.props.cart.map((item, index) => {
            return <div className="row">
                <div className="col-md-2">
                    <img src={item.image} width="100%" />
                </div>
                <div className="col-md-6">
                    <h5 style={{ fontWeight: 'bolder' }}>{item.nama}</h5>
                    <h4 style={{ fontWeight: 'bolder' }}>Rp {item.harga.toLocaleString()}</h4>
                </div>
                <div className="col-md-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex">
                            <span style={{ width: '50%', display: 'flex', alignItems: 'center' }}>
                                <span className="material-icons" style={{ cursor: 'pointer' }} onClick={() => this.onBtDec(index)}>
                                    remove
                                    </span>
                                <Input size="sm" placeholder="qty" value={item.qty} style={{ width: "50%", display: 'inline-block' }} />
                                <span className="material-icons" style={{ cursor: 'pointer' }} onClick={() => this.onBtInc(index)}>
                                    add
                            </span>
                            </span>
                        </div>
                        <h4>Rp {item.subTotal.toLocaleString()}</h4>
                    </div>
                    <Button outline color="warning" style={{ border: 'none', float: 'right' }} onClick={() => this.onBtRemove(index)}>Remove</Button>
                </div>
            </div>
        })
    }

    onBtRemove = (index) => {
        this.props.cart.splice(index, 1)
        axios.patch(URL_API + `/users/${this.props.id}`, { cart: this.props.cart })
            .then(res => {
                this.props.updateCart([...this.props.cart])
            }).catch(err => {
                console.log(err)
            })
    }

    onBtInc = (index) => {
        console.log(index)
        this.props.cart[index].qty += 1
        this.props.updateCart([...this.props.cart])
        // axios.patch
    }

    onBtDec = (index) => {
        console.log(index)
        this.props.cart[index].qty -= 1
        this.props.updateCart([...this.props.cart])
        // axios.patch
    }

    onBtCheckOut = () => {
        //1. mengurangi qty productnya dulu, yg ada direducer
        //2. axios.patch data product krn qty stocknya berubah
        //3. idUser,username,date,totalPayment,status(paid),cart
        //4. axios.post => userTransactions
        //5. data userTransaction ditampilkan di historyPage user, transactionPage Admin

        console.log(this.props.cart)
        console.log(this.props.products)
        this.props.cart.forEach((item, index) => {
            this.props.products.forEach((value, idx) => {
                if (item.nama == value.nama) {
                    // console.log(item.nama, value.nama)
                    // console.log(value.stock, item.type)
                    let idxStock = value.stock.findIndex(val => {
                        // console.log(val.type)
                        // console.log(item.type)
                        // val.type == item.type
                        return val.type == item.type
                    })
                    // console.log("idx", idxStock, item.qty)
                    // console.log("before", value.stock[idxStock])
                    value.stock[idxStock].qty -= item.qty
                    // console.log("after", value.stock[idxStock])
                    axios.patch(URL_API + `/products/${value.id}`, {
                        stock: value.stock
                    }).then(res=>{
                        console.log("pengurangan product",res.data)
                    }).catch(err => console.log(err))
                }
            })
        })
        // 
    }

    render() {
        console.log(this.props.cart)
        return (
            <div>
                <h1 className="text-center mt-5">Keranjang Belanja</h1>
                <div className="mt-5">
                    {this.printCart()}
                </div>
                <Button type="button" onClick={this.onBtCheckOut}>Checkout</Button>
            </div>
        );
    }
}

const mapToProps = ({ authReducer, productReducers }) => {
    return {
        ...authReducer, products: productReducers.products_list
    }
}

export default connect(mapToProps, { updateCart })(CartPage);
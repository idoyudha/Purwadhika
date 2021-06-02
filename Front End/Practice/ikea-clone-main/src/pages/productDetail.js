import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { Button, Collapse, Input } from 'reactstrap';
import { URL_API } from '../helper';

class ProductDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detail: {},
            thumbnail: 0,
            openType: false,
            quantity: 1,
            selectedType: {},
            cart: []
        }
    }

    componentDidMount() {
        this.getProductDetail()
    }

    getProductDetail = () => {
        console.log('props location', this.props.location)
        // axios.get(URL_API + `/products${this.props.location.search}`)
        axios.get(URL_API + `/products${this.props.location.search}`)
            .then(response => {
                console.log("data detail product", response.data)
                this.setState({ detail: response.data[0] })
            }).catch(error => {
                console.log(error)
            })
    }

    onBtAddToCart = () => {
        // mengambil data cart user dari reducer
        // data produk di push kedalam array.cart reducer
        // console.log(this.props.cart)
        // let cartData = this.props.cart
        // console.log('cartdata', cartData)
        // for (let data in cartData) {
        //     for (let x in data) {
        //         console.log(x)
        //     }
        // }
        // console.log('FINDINDEX', index)
        if (this.state.selectedType.type) {
            this.state.cart.push({
                iduser: this.props.iduser,
                idproduct: this.state.selectedType.idproduct,
                idstock: this.state.selectedType.idproduct_stock, 
                quantity: this.state.quantity
            })
            this.props.cart.push({
                iduser: this.props.iduser,
                idproduct: this.state.selectedType.idproduct,
                idstock: this.state.selectedType.idproduct_stock, 
                quantity: this.state.quantity,
                price: this.state.detail.price,
                images: this.state.detail.images[0].images,
                name: this.state.detail.name,
                type: this.state.selectedType.type
            })
            // simpan lewat axios.patch
            console.log('PROPS CART AFTER add', this.props.cart)
            axios.post(URL_API + `/transaction/add-cart`, this.state.cart )
                .then(response => {
                    alert('Add to cart success ✔')
                }).catch(error => {
                    console.log(error)
                })
        } else {
            alert('Choose product type first')
        }
    }

    renderImages = () => {
        let { images } = this.state.detail
        return images.map((item, index) => {
            return (
                <img className="select-image mb-1" src={item.images}
                    key={index}
                    width="100%"
                    onClick={() => this.setState({ thumbnail: index })}
                    style={{ borderBottom: this.state.thumbnail == index && "3px solid #407AB1" }}
                />
            )
        })
    }

    onBtInc = () => {
        console.log('qty', this.state.quantity)
        if (this.state.quantity < this.state.selectedType.quantity) {
            this.setState({ quantity: this.state.quantity += 1 })
        } else {
            alert('Product out of stock')
        }
    }

    onBtDec = () => {
        if (this.state.quantity > 1) {
            this.setState({ quantity: this.state.quantity -= 1 })
        }
    }

    render() {
        console.log('State detail all', this.state)
        console.log('Props', this.props)
        return (
            <div className="row p-5">
                {
                    this.state.detail.idproduct &&
                    <>
                        <div className="col-md-1">
                            {this.renderImages()}
                        </div>
                        <div className="col-md-7">
                            <img src={this.state.detail.images[this.state.thumbnail].images} width="100%" />
                        </div>
                        <div className="col-md-4">
                            <div style={{ borderBottom: '1.5px solid gray' }}>
                                <h4 style={{ fontWeight: 'bolder' }}>{this.state.detail.name}</h4>
                                <h6 className="text-mute">{this.state.detail.category}</h6>
                                <h2 style={{ fontWeight: 'bolder' }}>Rp {this.state.detail.price.toLocaleString()}</h2>
                            </div>
                            <div style={{ borderBottom: '1.5px solid gray' }}>
                                <div
                                    style={{ cursor: 'pointer', fontWeight: 'bold' }}
                                    onClick={() => this.setState({ openType: !this.state.openType })}>
                                    Type: {this.state.selectedType.type}</div>
                                <Collapse isOpen={this.state.openType}>
                                    {
                                        this.state.detail.stock.map((item, index) => {
                                            return (
                                                <div>
                                                    <Button outline color="secondary" size="sm"
                                                        style={{ width: '100%', border: 'none', textAlign: 'left' }}
                                                        onClick={() => this.setState({ selectedType: item, quantity: 1 })}
                                                    > {item.type} : {item.quantity}</Button>
                                                </div>
                                            )
                                        })
                                    }
                                </Collapse>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>Jumlah :</span>
                                <span style={{ width: '30%', display: 'flex', alignItems: 'center', border: '1px solid gray' }}>
                                    <span className="material-icons" style={{ cursor: 'pointer' }} onClick={this.onBtDec}>
                                        remove
                                    </span>
                                    <Input size="sm" placeholder="qty" value={this.state.quantity} style={{ width: "50%", display: 'inline-block' }} />
                                    <span className="material-icons" style={{ cursor: 'pointer' }} onClick={this.onBtInc}>
                                        add
                                    </span>
                                </span>
                            </div>
                            <Button type="button" color="warning" style={{ width: '100%' }} onClick={this.onBtAddToCart}>Add to cart</Button>
                        </div>
                    </>
                }
            </div>
        );
    }
}

const mapToProps = ({ authReducer }) => {
    return {
        ...authReducer
    }
}

export default connect(mapToProps)(ProductDetail);
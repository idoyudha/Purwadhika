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
            qty: 1,
            selectedType: {}
        }
    }

    componentDidMount() {
        this.getProductDetail()
    }

    getProductDetail = () => {
        console.log(this.props.location)
        axios.get(URL_API + `/products${this.props.location.search}`)
            .then(res => {
                console.log("data detail product", res.data)
                this.setState({ detail: res.data[0] })
            }).catch(err => {
                console.log(err)
            })
    }

    onBtAddToCart = () => {
        // qty, nama, type, price, total,image
        // mengambil data cart user dari reducer
        // data produk di push kedalam array.cart reducer
        console.log(this.props.cart)
        if (this.state.selectedType.type) {
            this.props.cart.push({
                qty: this.state.qty, nama: this.state.detail.nama,
                type: this.state.selectedType.type,
                harga: this.state.detail.harga,
                subTotal: this.state.qty * this.state.detail.harga,
                image: this.state.detail.images[0]
            })
            // simpan lewat axios.patch
            axios.patch(URL_API + `/users/${this.props.id}`, { cart: this.props.cart })
                .then(res => {
                    alert('Add to cart success ✔')
                }).catch(err => {
                    console.log(err)
                })
        } else {
            alert('Choose product type first')
        }

    }

    renderImages = () => {
        let { images } = this.state.detail
        return images.map((item, index) => {
            return (
                <img className="select-image mb-1" src={item}
                    key={index}
                    width="100%"
                    onClick={() => this.setState({ thumbnail: index })}
                    style={{ borderBottom: this.state.thumbnail == index && "3px solid #407AB1" }}
                />
            )
        })
    }

    onBtInc = () => {
        if (this.state.qty < this.state.selectedType.qty) {
            this.setState({ qty: this.state.qty += 1 })
        } else {
            alert('Product out of stock')
        }
    }

    onBtDec = () => {
        if (this.state.qty > 1) {
            this.setState({ qty: this.state.qty -= 1 })
        }
    }

    render() {
        return (
            <div className="row p-5">
                {
                    this.state.detail.id &&
                    <>
                        <div className="col-md-1">
                            {this.renderImages()}
                        </div>
                        <div className="col-md-7">
                            <img src={this.state.detail.images[this.state.thumbnail]} width="100%" />
                        </div>
                        <div className="col-md-4">
                            <div style={{ borderBottom: '1.5px solid gray' }}>
                                <h4 style={{ fontWeight: 'bolder' }}>{this.state.detail.nama}</h4>
                                <h6 className="text-mute">{this.state.detail.kategori}</h6>
                                <h2 style={{ fontWeight: 'bolder' }}>Rp {this.state.detail.harga.toLocaleString()}</h2>
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
                                                        onClick={() => this.setState({ selectedType: item, qty: 1 })}
                                                    > {item.type} : {item.qty}</Button>
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
                                    <Input size="sm" placeholder="qty" value={this.state.qty} style={{ width: "50%", display: 'inline-block' }} />
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
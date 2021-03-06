import React from 'react';
import axios from 'axios';
import { Button, Table, Badge, Input } from 'reactstrap';
import ModalProduct from '../components/modalProduct';
import ModalEditProduct from '../components/modalEditProduct';
import { URL_API } from '../helper'
import { connect } from 'react-redux'
import { getProductAction } from '../actions'

let kursor = {
    cursor: "pointer",
    marginRight: '0.5vw'
}

class ProductManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            modalEditOpen: false,
            data: [],
            detailProduk: {},
            thumbnail: 0
        }
    }

    deleteProduct = (id) => {
        var answer = prompt("Are you sure want to delete this product? (YES/NO)")
        if (answer == null) {
            console.log('NULL')
        }
        else if (answer.toLocaleLowerCase() == 'no') {
            console.log('NO')
            console.log(this.props.getProductAction)
        }
        else {
            console.log('YES')
            axios.delete(URL_API + `/products/delete/${id}`)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
        }
    }

    printProduk = () => {
        return this.props.products.map((item, index) => {
            console.log(item.images[0].images.slice(0,1))
            return <tr>
                <td>{index + 1}</td>
                <td style={{ width: '20vw', textAlign: 'center' }}>
                    {
                        this.state.thumbnail[0] === index ?
                            <img src={
                                item.images[this.state.thumbnail[1]].images
                            } width="80%" alt={item.name + index} />
                            :
                            <img src={item.images[0].images.slice(0,1) === 'h' ? item.images[0].images : URL_API + item.images[0].images} width="80%" alt={item.name + index} />
                    }
                    <div>
                        {   
                            item.images.map((value, idx) => {
                                // console.log('thumbnail after click', this.state.thumbnail)
                                return <img src={value.images.slice(0,1) === 'h' ? value.images : URL_API + value.images} style={kursor} width="20%" alt={item.name + idx}
                                    onClick={() => this.setState({ thumbnail: [index, idx] })} />
                            })
                        }
                    </div>
                </td>
                <td>{item.name}</td>
                <td>{item.brand}</td>
                <td>{
                    item.stock.map((item, index) => {
                        return <h5>{item.type} : <Badge color={item.quantity >= 12 ? "success" : "warning"}>{item.quantity}</Badge></h5>
                    })
                }</td>
                <td>Rp. {item.price.toLocaleString()}</td>
                <td><Button type="button" size="sm" color="warning" onClick={() => this.setState({ detailProduk: item, modalEditOpen: !this.state.modalEditOpen })}>Edit</Button>
                    <Button size="sm" color="danger" onClick={() => this.deleteProduct(item.idproduct)}>Delete</Button></td>
            </tr>
        })
    }

    handleSort = () => {
        let field = this.sortProduct.value.split('-')[0]
        let sortType = this.sortProduct.value.split('-')[1]
        axios.get(URL_API + `/products?_sort=${field}&_order=${sortType}`)
            .then(res => {
                console.log(field, sortType, res.data)
                this.setState({ data: res.data })
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        console.log(URL_API)
        return (
            <div className="p-2">
                <h3 className="text-center">Produk Management</h3>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Input style={{ width: '20%' }} type="select" onClick={this.handleSort} placeholder="sort"
                        innerRef={el => this.sortProduct = el}>
                        <option value="nama-asc">Nama Asc</option>
                        <option value="nama-desc">Nama Desc</option>
                        <option value="harga-asc">Harga Asc</option>
                        <option value="harga-desc">Harga Desc</option>
                    </Input>
                    <Button type="button" color="success" onClick={() => this.setState({ modalOpen: !this.state.modalOpen })}>Add</Button>
                </div>
                {/* Modal untuk detail product */}
                <ModalEditProduct modalOpen={this.state.modalEditOpen} detailProduk={this.state.detailProduk}
                    btClose={() => this.setState({ modalEditOpen: !this.state.modalEditOpen })} getData={this.props.getProductAction} />
                {/* Modal untuk add product */}
                <ModalProduct modalOpen={this.state.modalOpen}
                    btClose={() => this.setState({ modalOpen: !this.state.modalOpen })} getData={this.props.getProductAction} />
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product</th>
                            <th>Nama</th>
                            <th>Brand</th>
                            <th>Stok</th>
                            <th>Harga</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.printProduk()}
                    </tbody>
                </Table>
            </div>
        );
    }
}

const mapToProps = ({ productReducers }) => {
    return {
        products: productReducers.products_list
    }
}

export default connect(mapToProps, { getProductAction })(ProductManagement);
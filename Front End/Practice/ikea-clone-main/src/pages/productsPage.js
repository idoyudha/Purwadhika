import React from 'react';
import CardProduct from '../components/cardProducts';
import { connect } from 'react-redux'
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Input
} from 'reactstrap';
import axios from 'axios';
import { URL_API } from '../helper'
import { getProductAction, sortProducts } from '../actions'
import { Link } from 'react-router-dom'

class ProductsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.products,
            key: true
        }
    }

    // untuk menjalankan fungsi ketika ada perubahan data pada state dan juga props
    componentDidUpdate() {
        if (this.props.products.length > 0 && this.state.key) {
            this.setState({ data: this.props.products, key: false })
        }
    }

    printProducts = () => {
        // if (this.props.productsList.length > 0) {
        return this.state.data.map((item, index) => {
            return <div className="col-md-3 mt-2">
                <Card style={{ border: 'none' }}>
                    <Link to={`/product-detail?id=${item.id}`} style={{textDecoration:'none',color:'black'}}>
                        <CardImg top width="100%" src={item.images[0]} alt="Card image cap" />
                        <CardBody>
                            <CardTitle tag="h5" style={{ fontWeight: 'bolder' }}>{item.nama}</CardTitle>
                            <CardSubtitle style={{ fontSize: '14px' }} className="mb-2 text-muted">{item.kategori}</CardSubtitle>
                            <CardText tag="h5" style={{ fontWeight: 'bolder' }}>Rp. {item.harga.toLocaleString()}</CardText>
                            <Button type="button" outline
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span class="material-icons">
                                    visibility
                        </span>
                                <span>Lihat Sekilas</span>
                            </Button>
                        </CardBody>
                    </Link>
                </Card>
            </div>
        })
        // }
    }

    // Cara 1: sort data dari json-server
    handleSort = () => {
        console.log(this.sortField.value, this.sortField.value.split('-'))
        let field = this.sortField.value.split('-')[0]
        let sortType = this.sortField.value.split('-')[1]

        axios.get(URL_API + `/products?_sort=${field}&_order=${sortType}`)
            .then(res => {
                this.props.getProductAction()
            }).catch(err => {
                console.log(err)
            })
    }

    // Cara 2 : sort dari data reducer
    handleSortReducer = () => {
        let field = this.sortField.value.split('-')[0];
        let sortType = this.sortField.value.split('-')[1]
        let tempData = [...this.props.products]; // duplicate data dari reducer ke varibel tempData
        if (sortType == 'asc') {
            let dataAsc = tempData.sort((a, b) => {
                return a[field] - b[field] // b[field] sama dengan b.field
            })
            this.setState({ data: dataAsc })
            // this.props.sortProducts(dataAsc)
        } else if (sortType == "desc") {
            let dataDesc = tempData.sort((a, b) => {
                return b[field] - a[field]
            })
            this.setState({ data: dataDesc })
            // this.props.sortProducts(dataDesc)
        }
    }

    render() {
        return (
            <div className="container">
                <Input type="select" style={{ width: "10vw", float: 'right' }} placeholder="Sort Data" onChange={this.handleSortReducer} innerRef={el => this.sortField = el}>
                    <option value="harga-asc">Harga Asc</option>
                    <option value="harga-desc">Harga Desc</option>
                    <option value="nama-asc">A-Z</option>
                    <option value="nama-desc">Z-A</option>
                    <option value="id-asc">Reset</option>
                </Input>
                <div className="container row" style={{ margin: 'auto', marginTop: '3vh' }}>
                    {this.printProducts()}
                </div>
            </div>
        );
    }
}

const mapToProps = ({ productReducers }) => {
    return {
        products: productReducers.products_list,
        productsList: productReducers.products_sort
    }
}

export default connect(mapToProps, { getProductAction, sortProducts })(ProductsPage);
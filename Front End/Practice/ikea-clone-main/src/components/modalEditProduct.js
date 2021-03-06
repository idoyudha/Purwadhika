import axios from 'axios';
import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { URL_API } from '../helper'
class ModalEditProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stock: props.detailProduk.stock,
            images: props.detailProduk.images
        }
    }

    onBtAdd = () => {
        console.log(this.state.stock)
        axios.post(URL_API + '/products', {
            name: this.inNama.value,
            description: this.inDeskripsi.value,
            brand: this.inBrand.value,
            price: parseInt(this.inHarga.value),
            stock: this.state.stock,
            images: this.state.images
        }).then(res => {
            console.log(res.data)
            alert('Edit Product Success')
            this.props.getData()
        }).catch(err => {
            console.log(err)
            alert('Fail to Edit Product')
        })
    }

    onBtAddStock = () => {
        // let tempStock = [...this.state.stock]
        this.state.stock.push({ id: null, type: null, qty: null })
        this.setState({ stock: this.state.stock })
    }

    onBtAddImages = () => {
        this.state.images.push("")
        this.setState({ images: this.state.images })
    }

    printStock = () => {
        let stock = this.state.stock || this.props.detailProduk.stock
        if (stock) {
            return stock.map((item, index) => {
                return <Row>
                    <Col>
                        <Input type="text" defaultValue={item.type} placeholder={`Type-${index + 1}`} onChange={(e) => this.handleType(e, index)} />
                    </Col>
                    <Col>
                        <Input type="number" defaultValue={item.quantity} placeholder={`Stock-${index + 1}`} onChange={(e) => this.handleStock(e, index)} />
                    </Col>
                    <Col>
                        <a onClick={() => this.onBtDeleteStock(index)} style={{ cursor: 'pointer' }}>Delete</a>
                    </Col>
                </Row>
            })
        }
    }

    printImages = () => {
        let images = this.state.images || this.props.detailProduk.images
        if (images) {
            return images.map((item, index) => {
                return <Input type="text" defaultValue={item.images} placeholder={`Images-${index + 1}`} onChange={(e) => this.handleImages(e, index)} />
            })
        }
    }

    onBtDeleteStock = (index) => {
        this.props.detailProduk.stock.splice(index, 1)
        this.setState({ stock: this.state.stock })
    }

    handleImages = (e, index) => {
        this.props.detailProduk.images[index].images = e.target.value
    }

    handleType = (e, index) => {
        this.props.detailProduk.stock[index].type = e.target.value
    }

    handleStock = (e, index) => {
        this.props.detailProduk.stock[index].quantity = parseInt(e.target.value)
    }

    onBtCancel = () => {
        this.props.btClose()
    }

    onBtSave = (id) => {
        axios.patch(URL_API + `/products/update`, {
            idproduct: id,
            name: this.inNama.value,
            description: this.inDeskripsi.value,
            brand: this.inBrand.value,
            price: parseInt(this.inHarga.value),
            stock: this.props.detailProduk.stock,
            images: this.props.detailProduk.images
        })
            .then(res => {
                console.log(res.data)
                this.props.getData()
                this.props.btClose()
            }).catch(err => {
                console.log(err)
            })
    }

    render() {
        // console.log("detailProduk", this.props.detailProduk)
        let { name, description, brand, price, idproduct } = this.props.detailProduk
        return (
            <Modal isOpen={this.props.modalOpen} toggle={this.props.btClose} >
                <ModalHeader toggle={this.props.btClose}>Edit Product</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="textNama">Nama Product</Label>
                        <Input type="text" id="textNama" defaultValue={name} innerRef={elemen => this.inNama = elemen} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="textDes">Deskripsi</Label>
                        <Input type="text" defaultValue={description} id="textDes" innerRef={elemen => this.inDeskripsi = elemen} />
                    </FormGroup>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for="textBrand">Brand</Label>
                                <Input type="text" defaultValue={brand} id="textBrand" innerRef={elemen => this.inBrand = elemen} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <FormGroup>
                        <Label for="textHarga">Harga</Label>
                        <Input type="number" defaultValue={price} id="textHarga" innerRef={elemen => this.inHarga = elemen} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Stock</Label>
                        <Button outline color="success" type="button" size="sm" style={{ float: 'right' }} onClick={this.onBtAddStock}>Add Stock</Button>
                        {this.printStock()}
                    </FormGroup>
                    <FormGroup>
                        <Label>Images</Label>
                        <Button outline color="success" type="button" size="sm" style={{ float: 'right' }} onClick={this.onBtAddImages} >Add Image</Button>
                        {this.printImages()}
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color="primary" onClick={() => this.onBtSave(idproduct)}>Save</Button>{' '}
                    <Button color="secondary" onClick={this.onBtCancel}>Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default ModalEditProduct;
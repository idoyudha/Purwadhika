import axios from 'axios';
import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { URL_API } from '../helper'
class ModalProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stock: [],
            images: []
        }
    }

    onBtAdd = () => {
        console.log(this.state.stock)
        axios.post(URL_API + '/products', {
            nama: this.inNama.value,
            deskripsi: this.inDeskripsi.value,
            brand: this.inBrand.value,
            kategori: this.inKategori.value,
            harga: parseInt(this.inHarga.value),
            stock: this.state.stock,
            images: this.state.images
        }).then(res => {
            console.log(res.data)
            this.props.getData()
            alert('Add Product Success')
        }).catch(err => {
            console.log(err)
        })
    }

    onBtAddStock = () => {
        // let tempStock = [...this.state.stock]
        this.state.stock.push({ id: null, type: null, qty: null })
        this.setState({ stock: this.state.stock })
    }

    // menambah penampung data image pada state.images
    onBtAddImages = () => {
        this.state.images.push("")
        this.setState({ images: this.state.images })
    }

    printStock = () => {
        if (this.state.stock.length > 0) {
            return this.state.stock.map((item, index) => {
                return <Row>
                    <Col>
                        <Input type="text" placeholder={`Type-${index + 1}`} onChange={(e) => this.handleType(e, index)} />
                    </Col>
                    <Col>
                        <Input type="number" placeholder={`Stock-${index + 1}`} onChange={(e) => this.handleStock(e, index)} />
                    </Col>
                    <Col>
                        <a onClick={() => this.onBtDeleteStock(index)} style={{ cursor: 'pointer' }}>Delete</a>
                    </Col>
                </Row>
            })
        }
    }

    // render element input form image
    printImages = () => {
        if (this.state.images.length > 0) {
            return this.state.images.map((item, index) => {
                return <Input type="text" placeholder={`Images-${index + 1}`} 
                onChange={(e) => this.handleImages(e, index)} />
            })
        }
    }

    onBtDeleteStock = (index) => {
        this.state.stock.splice(index, 1)
        this.setState({ stock: this.state.stock })
    }

    // Untuk set value kedalam state.images
    handleImages = (e, index) => {
        this.state.images[index] = e.target.value
    }

    handleType = (e, index) => {
        this.state.stock[index].type = e.target.value
    }

    handleStock = (e, index) => {
        this.state.stock[index].qty = parseInt(e.target.value)
    }

    onBtCancel = () => {
        this.setState({ stock: [], images: [] })
        // fungsi untuk close modal
        this.props.btClose()
    }

    render() {
        console.log('ModalOpen', this.props.modalOpen)
        return (
            <Modal isOpen={this.props.modalOpen} toggle={this.props.btClose} >
                <ModalHeader toggle={this.props.btClose}>Add Product</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="textNama">Nama Product</Label>
                        <Input type="text" id="textNama" innerRef={elemen => this.inNama = elemen} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="textDes">Deskripsi</Label>
                        <Input type="text" id="textDes" innerRef={elemen => this.inDeskripsi = elemen} />
                    </FormGroup>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for="textBrand">Brand</Label>
                                <Input type="text" id="textBrand" innerRef={elemen => this.inBrand = elemen} />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label for="textKategori">Kategori</Label>
                                <Input type="text" id="textKategori" innerRef={elemen => this.inKategori = elemen} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <FormGroup>
                        <Label for="textHarga">Harga</Label>
                        <Input type="number" id="textHarga" innerRef={elemen => this.inHarga = elemen} />
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
                    <Button type="button" color="primary" onClick={this.onBtAdd}>Submit</Button>{' '}
                    <Button color="secondary" onClick={this.onBtCancel}>Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default ModalProduct;
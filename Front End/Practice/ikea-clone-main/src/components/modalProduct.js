import axios from 'axios';
import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { URL_API } from '../helper'
class ModalProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stock: [],
            images: [],
            category: [],
            fileName: "Select file",
            fileUpload: null
        }
    }

    componentDidMount() {
        this.getCategory()
    }

    onBtnFile = (event) => {
        if (event.target.files[0]) {
            this.setState({
                fileName: event.target.files[0].name, 
                fileUpload: event.target.files[0]
            })
        }
        else {
            this.setState({fileName: "Select file", fileUpload: "https://blackmantkd.com/wp-content/uploads/2017/04/default-image-620x600.jpg"})
        }
    }

    onBtAdd = () => {
        // console.log('STOCK STATE', this.state.stock)
        // console.log('IMAGE STATE', this.state.images)
        // console.log('SELECTED CATEGORY', this.inCategory.value)
        let formData = new FormData()
        let data = {
            name: this.inNama.value,
            description: this.inDeskripsi.value,
            brand: this.inBrand.value,
            price: parseInt(this.inHarga.value),
            stock: this.state.stock,
            idcategory: this.inCategory.value
        }
        formData.append('data', JSON.stringify(data))
        console.log("Fileupload", this.state.fileUpload)
        formData.append('images', this.state.fileUpload)
        axios.post(URL_API + '/products/add', formData)
            // images: this.state.images,
            // idcategory: this.inCategory.value
        .then(response => {
            console.log(response.data)
            this.props.getData()
            this.props.btClose()
            alert('Add Product Success')
        }).catch(error => {
            console.log(error)
            alert('Fail to Add Product')
        })
    }

    onBtAddStock = () => {
        // let tempStock = [...this.state.stock]
        this.state.stock.push({idproduct: null, type: null, quantity: null})
        this.setState({ stock: this.state.stock })
    }

    // menambah penampung data image pada state.images
    onBtAddImages = () => {
        this.state.images.push({idproduct: null, images: null})
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
        this.state.images[index].images = e.target.value
    }

    handleType = (e, index) => {
        this.state.stock[index].type = e.target.value
    }

    handleStock = (e, index) => {
        this.state.stock[index].quantity = parseInt(e.target.value)
    }

    onBtCancel = () => {
        this.setState({ stock: [], images: [] })
        // fungsi untuk close modal
        this.props.btClose()
    }

    getCategory = () => {
        axios.get(URL_API + `/products/category`)
        .then(response => {
            // console.log(response.data)
            let data = response.data
            this.setState({ category: data })
        })
        .catch(error => {
            console.log(error)
        })
    }

    printCategory = () => {
        // console.log('Category', this.state.category)
        if (this.state.category.length > 0) {
            return this.state.category.map((item) => {
                return <option value={item.idcategory}>{item.category}</option>
            })
        }
    }

    render() {
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
                    <FormGroup>
                        <Label for="category">Select Category</Label>
                        <Input type="select" name="select" id="category" innerRef={elemen => this.inCategory = elemen}>
                            {this.printCategory()}
                        </Input>
                    </FormGroup>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for="textBrand">Brand</Label>
                                <Input type="text" id="textBrand" innerRef={elemen => this.inBrand = elemen} />
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
                    <Row form>
                        <Col md={6}>
                            <img src={this.state.fileUpload ? URL.createObjectURL(this.state.fileUpload) : "https://blackmantkd.com/wp-content/uploads/2017/04/default-image-620x600.jpg"} alt="" width="100" height="100"/>
                        </Col>
                        <Col md={6}>
                            <Label>Images</Label>
                            <Input type="file" onChange={this.onBtnFile} label={this.state.fileName}/>
                        </Col>
                    </Row>
                        {/* <Button outline color="success" type="button" size="sm" style={{ float: 'right' }} onClick={this.onBtAddImages} >Add Image</Button> */}
                        {/* {this.printImages()} */}
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
import axios from 'axios';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { updateProductAction, getProductAction } from '../actions/productAction';


const ModalProductComp = ({ toggle, modal }) => {
  // const inputPict = useRef(null)
  // const inputName = useRef(null)
  // const inputCat = useRef(null)
  // const inputStock = useRef(null)
  // console.log('toggle and modal', toggle, modal, onClick)

  // Data
  const [name, setName] = useState(null)
  const [images, setImages] = useState(null)
  const [category, setCategory] = useState("Fashion")
  const [stock, setStock] = useState(null)
  const [price, setPrice] = useState(null)
  const [status, setStatus] = useState("")

  // Alert
  const [alertFail, setAlertFail] = useState(false)
  const [alertPost, setAlertPost] = useState(false)

  const dispatch = useDispatch()

  const postProduct = () => {
    if (name !== null && images !== null && category !== null && stock !== null && price !== null && status !== "") {
      axios.post(`http://localhost:2020/products`, {
          name, category, price, stock, images, status
      })
      .then(response => {
        console.log('response post', response.data)
        dispatch(getProductAction())
        setAlertPost(true)
        setTimeout(() => {
          setAlertPost(false)
        }, 2000);
      })
      .catch(error => {
        console.log(error)
      })
    }
    else {
      console.log('Must fill all')
      setAlertFail(true)
      setTimeout(() => {
        setAlertFail(false)
      }, 2000);
    }
  }

  const inputProduct = () => {
    console.log('select value'. category)
    // console.log(inputPict.current.focus())
    // console.log(inputName.current.focus())
    // console.log(inputCat.current.focus())
    // console.log(inputStock.current.focus())
    if (stock > 10) {
      setStatus('Available')
      postProduct()
    }
    else if (stock < 10 && stock > 0) {
      setStatus('Almost running out') 
      postProduct()
    } 
    else {
      setStatus('Not available')
      postProduct()
    }    
  }

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
        <ModalBody>
        <Alert color="danger" isOpen={alertFail}>
          Must fill all form
        </Alert>
        <Alert color="success" isOpen={alertPost}>
          Success add product
        </Alert>
        <Form>
          <FormGroup>
            <Label>Name</Label>
            <Input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Label>Picture URL</Label>
            <Input type="url" value={images} onChange={(e) => setImages(e.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Label>Category</Label>
            <Input type="text" value={category} onChange={(e) => setCategory(e.target.value)}>
              {/* <option value={"House"}>House</option>
              <option value={"Fashion"}>Fashion</option>
              <option value={"Electronics"}>Electronics</option> */}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label>Stock</Label>
            <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Label>Price</Label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)}/>
          </FormGroup>
        </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={inputProduct}>Add Product</Button>{' '}
          <Button color="secondary" onClick={toggle}>Close</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ModalProductComp;
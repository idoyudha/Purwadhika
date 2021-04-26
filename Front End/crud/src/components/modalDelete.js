import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { URL_API } from '../url';
import { updateProductAction } from '../actions/productAction';

const ModalDelete = ({ toggle, modal, index }) => {

    const { product_data } = useSelector(({ productReducer }) => {
        console.log("check products", productReducer.product_data)
        return {
            product_data: productReducer.product_data
        }
    })

    const dispatch = useDispatch()

    const deleteProduct = () => {
        console.log('delete data', product_data[index])
        product_data.splice(index,1)
        console.log('after delete', product_data)
        axios.delete(URL_API + `products/${index}`)
        .then(response => {
            console.log(response.data)
            axios.get(URL_API + `products`)
            .then(response => {
                console.log('data', response.data)
                dispatch(updateProductAction(response.data))
            })
            .catch(error => {
                console.log(error)
            })
        }).catch(error => {
            console.log(error)
        })
    }
    return (
        <div>
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Modal title</ModalHeader>
            <ModalBody>
                Are you sure want to delete this item?
            </ModalBody>
            <ModalFooter>
            <Button color="danger" onClick={deleteProduct}>Sure</Button>
            <Button color="secondary" onClick={toggle}>Not Sure</Button>
            </ModalFooter>
        </Modal>
        </div>
    )
}

export default ModalDelete

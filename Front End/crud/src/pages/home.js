import React, { useEffect, useState } from 'react'
import TableComponent from '../components/table';
import { Button } from 'reactstrap';
import ModalProductComp from '../components/modalProduct';
import axios from 'axios';
import { URL_API } from '../url';
import { getDataProduct, getProductAction } from '../actions/productAction';
import { useDispatch } from 'react-redux';

const HomePage = () => {
    
    // const [products, setProducts] = useState([])
    const [modal, setModal] = useState(false);

    const toggle = () => {
        setModal(!modal)
    }
    
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getProductAction()) // redux thunk
        // getProduct() 
    }, [])
    
    const getProduct = () => {
      axios.get(URL_API + `products`)
      .then(response => {
        console.log('data', response.data)
        // setProducts(response.data)
        // getDataProduct(response.data) // ordinary redux not running don't know why
      })
      .catch(error => {
        console.log(error)
      })
    }

    return (
        <div className="container-fluid">
            <Button color="primary" onClick={toggle}>Add Product</Button>
            <ModalProductComp toggle={toggle} modal={modal} />
            <TableComponent/>
        </div>
    )
}

export default HomePage

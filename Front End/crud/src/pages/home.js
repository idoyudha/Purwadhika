import React, { useEffect, useState } from 'react'
import TableComponent from '../components/table';
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ModalProductComp from '../components/modalProduct';
import axios from 'axios';
import { URL_API } from '../url';
import { getDataProduct, getProductAction, sortByStatus } from '../actions/productAction';
import { useDispatch } from 'react-redux';

const HomePage = () => {
    
    // const [products, setProducts] = useState([])
    const [modal, setModal] = useState(false);

    const toggle = () => {
        setModal(!modal)
    }
    
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdow = () => setDropdownOpen(prevState => !prevState);
    
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

    const sortAsc = () => {
      dispatch(sortByStatus("asc"))
    }

    const sortDesc = () => {
      dispatch(sortByStatus("desc"))
    }

    return (
        <div className="container-fluid">
          <div className="row">
            <Button color="primary" onClick={toggle}>Add Product</Button>
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdow}>
            <DropdownToggle caret>
              Sort Status
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={sortAsc}>Ascending</DropdownItem>
              <DropdownItem onClick={sortDesc}>Descending</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          </div>
            <ModalProductComp toggle={toggle} modal={modal} />
            <TableComponent/>
        </div>
    )
}

export default HomePage

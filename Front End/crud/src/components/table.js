import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Table, Button } from 'reactstrap';
import ModalDelete from './modalDelete';

const TableComponent = () => {
    
    const { product_data } = useSelector(({ productReducer }) => {
        console.log("check products table", productReducer.product_data)
        return {
            product_data: productReducer.product_data
        }
    })
    // console.log('Table', props.data)
    console.log('TableReduccer', product_data)

    const [modal, setModal] = useState(false)
    const [index, setIndex] = useState(-1)


    const toggle = (index) => {
        setModal(!modal)
        setIndex(index)
    }

    const printProduct = () => {
        return product_data.map((item, index) => {
            return <tr>
                        <th>{item.id}</th>
                        <td><img width="170" src={item.images}/></td>
                        <td>{item.name}</td>
                        <td>{item.category}</td>
                        <td>{item.stock}</td>
                        <td>
                            {item.stock > 10 ? 'Available'
                            : 0 < item.stock < 10 ? 'Almost': 'Not Available'}
                        </td>
                        <td>
                            <Button color="danger" onClick={() => toggle(item.id)}>Delete</Button>
                        </td>
                    </tr>
        })
    }

    return (
        <>
            <Table striped>
                <thead>
                <tr>
                    <th>Product Code</th>
                    <th>Picture</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {printProduct()}
                </tbody>
                <ModalDelete toggle={toggle} modal={modal} index={index}/>
            </Table>  
        </>
    )
}

export default TableComponent

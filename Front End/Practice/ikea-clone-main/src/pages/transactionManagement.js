import React from 'react';
import axios from 'axios';
import { URL_API } from '../helper';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getDataTransaction } from '../actions';
import { connect } from 'react-redux';

class TransactiontManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transaction: [],
            modal: false,
            modalData: []
        }
    }

    componentDidMount() {
        this.getDataTransaction()    
    }

    getDataTransaction = () => {
        let idToken = localStorage.getItem("tkn_id")
        axios.get(URL_API + `/transaction/payment/${idToken}`)
        .then(response => {
            console.log('Response data transaction', response.data)
            this.setState({transaction: response.data})
            this.setState({modalData: response.data})
        })
        .catch(error => {
          console.log(error)
        })
    }

    toggle = (item) => { 
        this.setState({ modal: !this.state.modal })
        this.setState({ modalData: item })
    }

    printTransaction = () => {
        return this.state.transaction.map((item,index) => {
            return  <>
                        <tr>
                            <td>{item.invoice}</td>
                            <td>{item.date}</td>
                            <td>IDR {item.delivery_cost}</td>
                            <td>IDR {item.total_payment}</td>
                            <td>{item.note}</td>
                            <td>{item.status}</td>
                            <td>
                                <Button color="primary" onClick={() => this.toggle(item)} >Detail</Button>
                                { item.status == 'Unpaid' ?

                                    <Button color="danger" onClick={() => this.payButton(item.idtransaction)}>
                                        CONFIRM
                                    </Button>
                                    :
                                    <Button color="secondary" disabled>
                                        CONFIRMED
                                    </Button>
                                }
                            </td>
                        </tr>
                    </>
        })
    }

    payButton = (id) => {
        axios.patch(URL_API + `/transaction/pay/${id}`)
        .then(response => {
            // console.log('Response data transaction', response.data)
            this.getDataTransaction()
        })
        .catch(error => {
          console.log(error)
        })
    }

    printDetailTransaction = () => {
        let { detail } = this.state.modalData
        console.log('PRINT DETAIL TRANSACTION', detail)
        console.log('Props CHEKCOUT', this.props.checkout)
        if (detail != undefined && detail != 1) {
            return detail.map((item, index) => {
                return  <>
                            <tr>
                                <th>{index+1}</th>
                                <th>{item.name}</th>
                                <th>{item.type}</th>
                                <th>{item.price}</th>
                                <th>{item.quantity}</th>
                                <th>{item.subtotal}</th>
                            </tr>
                        </>
            })
        }
    }

    render() {
        console.log('Props CHEKCOUT', this.props.checkout)
        return (
            <>
                <h3 className="text-center">Transaction Management</h3>
                <p className="text-center">Need to refresh (bug)</p>
                <Table>
                    <thead>
                        <tr>
                            <th>Invoice</th>
                            <th>Date</th>
                            <th>Delivery Cost</th>
                            <th>Total Payment</th>
                            <th>Note</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.printTransaction()}
                    </tbody>
                </Table>
                
                <div>
                    {this.state.modalData != [] &&
                        <Modal isOpen={this.state.modal} toggle={this.toggle} size='lg'>
                            <ModalHeader toggle={this.toggle}>Detail</ModalHeader>
                            <ModalBody>
                                <p>Username: {this.state.modalData.username}</p>
                                <p>Date: {this.state.modalData.date}</p>
                                <p>Invoice: {this.state.modalData.invoice}</p>
                                <p>Note: {this.state.modalData.note}</p>
                                <p>Status: {this.state.modalData.status}</p>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Name</th>
                                            <th>Type</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.printDetailTransaction()}
                                    </tbody>
                                </Table>
                                <p>Delivery Cost: IDR {this.state.modalData.delivery_cost}</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="secondary" onClick={this.toggle}>Close</Button>
                            </ModalFooter>
                        </Modal>
                    } 
                </div>
            </>
        )
    }
}

const mapToProps = ({ authReducer }) => {
    return {
        checkout: authReducer.checkout
    }
}

export default connect(mapToProps, { getDataTransaction })(TransactiontManagement);
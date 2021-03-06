import axios from 'axios';
import React from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { URL_API } from '../helper';
import { getDataTransaction } from '../actions';
import { connect } from 'react-redux';

class CheckoutPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  
            transaction: [],
            modal: false,
            modalData: []
        }
    }

    componentDidMount() {
        this.props.getDataTransaction()  
        // this.getDataTransaction()    
    }

    // getDataTransaction = () => {
    //     let idToken = localStorage.getItem("tkn_id")
    //     axios.get(URL_API + `/transaction/payment/${idToken}`)
    //     .then(response => {
    //         console.log('Response data transaction', response.data)
    //         this.setState({transaction: response.data})
    //         this.setState({modalData: response.data})
    //     })
    //     .catch(error => {
    //       console.log(error)
    //     })
    // }

    toggle = (item) => { 
        this.setState({ modal: !this.state.modal })
        this.setState({ modalData: item })
    }

    convertTime = (data) => {
        let date = new Date(data);
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let dt = date.getDate();

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        if (dt < 10) {
            dt = '0' + dt;
        }

        return (dt + ' ' + monthNames[month] + ' ' + year);
    }

    printTransaction = () => {
        // return this.state.transaction.map((item,index) => {
        return this.props.checkout.map((item,index) => {
            return  <>
                        <tr>
                            <td>{item.invoice}</td>
                            <td>{this.convertTime(item.date)}</td>
                            <td>IDR {item.delivery_cost.toLocaleString()}</td>
                            <td>IDR {(item.total_payment + item.delivery_cost).toLocaleString()}</td>
                            <td>{item.note}</td>
                            <td>{item.status}</td>
                            <td>
                                <Button color="primary" onClick={() => this.toggle(item)} >Detail</Button>
                                { item.status == 'Unpaid' ?

                                    <Button color="danger" onClick={() => this.payButton(item.idtransaction)}>
                                        PAY
                                    </Button>
                                    :
                                    <Button color="secondary" disabled>
                                        PAID
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
            console.log('Response data transaction', response.data)
            this.props.getDataTransaction()  
        })
        .catch(error => {
          console.log(error)
        })
    }

    printDetailTransaction = () => {
        let { detail } = this.state.modalData
        // console.log('PRINT DETAIL TRANSACTION', detail)
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
        // console.log('State transaction', this.state.transaction)
        // console.log('PROPS HISTORY', this.props.checkout)
        return (  
            <>
                <h1 className="text-center mt-5">Checkout</h1>
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
                                <p>Date: {this.convertTime(this.state.modalData.date)}</p>
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
        );
    }
}
 
// export default CheckoutPage;

const mapToProps = ({ authReducer }) => {
    return {
        ...authReducer
    }
}

export default connect(mapToProps, { getDataTransaction })(CheckoutPage);
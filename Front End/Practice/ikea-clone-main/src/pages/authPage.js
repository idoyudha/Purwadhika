import React from 'react';
import axios from 'axios';
import { Container, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { URL_API } from '../helper';
import { connect } from 'react-redux'
import { authLogin } from '../actions'
import { Redirect } from 'react-router-dom';
import AlertVerification from '../components/alertVerif';

class AuthPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            passType: 'password',
            alert: false,
            message: '',
            alertType: '',
            status: null
        }
    }

    onBtRegis = () => {
        let username = this.inUsername.value
        let email = this.inRegisEmail.value
        let password = this.inRegisPassword.value
        let confPassword = this.inConfPassword.value
        let role = 'user'
        let idstatus = 12
        if (username == '' || email == '' || password == '' || confPassword == '') {
            // setState untuk membuka alert, dengan mengatur message serta type alert
            this.setState({ alert: !this.state.alert, message: "Isi semua form !", alertType: 'danger' })
            // melakukan reset terhadap alert menggunakan setTimeout
            setTimeout(() => this.setState({ alert: !this.state.alert, message: '', alertType: '' }), 3000)
        } else {
            if (email.includes('@')) {
                console.log(username, email, password, role, idstatus)
                axios.post(URL_API + `/users/register`, {
                    username, email, password, role, idstatus
                })
                    .then(res => {
                        console.log('Response', res.data)
                        if (res.data === "Email already registered!") {
                            this.setState({ alert: !this.state.alert, message: "Email already registered", alertType: 'danger' })
                            setTimeout(() => this.setState({ alert: !this.state.alert, message: '', alertType: '' }), 3000)
                        } else {
                            axios.post(URL_API + `/users/register`, {
                                username,
                                email,
                                password,
                                role: 'user',
                                idstatus: 12
                            })
                                .then(res => {
                                    this.setState({ alert: !this.state.alert, message: "Registrasi akun sukses ✔", alertType: 'success' })
                                    setTimeout(() => this.setState({ alert: !this.state.alert, message: '', alertType: '' }), 3000)
                                    this.inUsername.value = null
                                    this.inRegisEmail.value = null
                                    this.inRegisPassword.value = null
                                    this.inConfPassword.value = null
                                })
                                .catch(err => {
                                    console.log("Error Register", err)
                                })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                this.setState({ alert: !this.state.alert, message: "Email anda salah ❌", alertType: 'warning' })
                setTimeout(() => this.setState({ alert: !this.state.alert, message: '', alertType: '' }), 3000)
            }
        }
    }

    onBtLogin = async () => { 
        try {
            // console.log(this.inEmail.value, this.inPassword.value)
            let email = this.inEmail.value
            let password = this.inPassword.value
            // console.log(email, password)
            let response = await axios.post(URL_API + `/users/login`, {
                email, password
            })
            // console.log(response.data[0].idstatus)
            if (response.data[0].idstatus == 11) {
                this.props.authLogin(this.inEmail.value, this.inPassword.value)
            }
            else if (response.data[0].idstatus == 12) {
                this.setState({status: 12})
            }

        } 
        catch (error) {
            console.log(error)
        }
    }

    reLogin = () => {
        let idToken = localStorage.getItem("tkn_id")
        console.log('idToken', idToken)
        axios.get(URL_API + `/users?iduser=${idToken}`)
        .then(res => {
            console.log('Response keeplogin', res)
            this.props.keepLogin(res.data[0])
        })
        .catch(err => {
            console.log("Keeplogin error :", err)
        })
      }

    handlePassword = () => {
        console.log(this.inRegisPassword.value)

        let huruf = /[a-zA-Z]/
        let numb = /[0-9]/

        if (huruf.test(this.inRegisPassword.value) || numb.test(this.inRegisPassword.value)) {
            if (huruf.test(this.inRegisPassword.value) && numb.test(this.inRegisPassword.value)) {
                console.log("Huruf dan Angka")
            } else if (huruf.test(this.inRegisPassword.value)) {
                console.log("Hanya huruf")
            } else if (numb.test(this.inRegisPassword.value)) {
                console.log("Hanya angka")
            }
        }
    }

    render() {
        if (this.props.id) {
            return <Redirect to="/" />
        }
        return (
            <Container className="p-5">
                <h2 style={{ fontWeight: 'bold', textAlign: 'center' }}>Pilihan Masuk</h2>
                <p style={{ textAlign: 'center' }}>Masuk dan selesaikan pesanan dengan data pribadi Anda atau daftar untuk menikmati semua manfaat memiliki akun IKEA.</p>
                <div className="row">
                    <div className="col-6 p-5">
                        <h3>Silakan masuk ke akun Anda</h3>
                        <p>Silakan masuk ke akun Anda untuk menyelesaikan pembayaran dengan data pribadi Anda.</p>
                        {this.state.status == 12 ? (
                            <AlertVerification email={this.inEmail.value} password={this.inPassword.value}/>
                        ) : null}
                        <FormGroup>
                            <Label for="textEmail">Email</Label>
                            <Input type="email" id="textEmail" innerRef={elemen => this.inEmail = elemen} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="textPassword">Password</Label>
                            <Input type={this.state.passType} id="textPassword" innerRef={elemen => this.inPassword = elemen} />
                        </FormGroup>
                        <Button size="lg" style={{ width: '100%', backgroundColor: '#0058AB' }} onClick={this.onBtLogin}>Masuk</Button>
                    </div>
                    <div className="col-6 p-5">
                        <h3>Silakan buat akun Anda</h3>
                        <Alert isOpen={this.state.alert} color={this.state.alertType}>
                            {this.state.message}
                        </Alert>
                        <FormGroup>
                            <Label for="textUsername">Username</Label>
                            <Input type="text" id="textUsername" innerRef={elemen => this.inUsername = elemen} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="textEmail">Email</Label>
                            <Input type="email" id="textEmail" innerRef={elemen => this.inRegisEmail = elemen} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="textPassword">Password</Label>
                            <Input type={this.state.passType} onChange={this.handlePassword} id="textPassword" innerRef={elemen => this.inRegisPassword = elemen} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="textConfPassword"> Confirmation Password</Label>
                            <Input type={this.state.passType} id="textConfPassword" innerRef={elemen => this.inConfPassword = elemen} />
                        </FormGroup>
                        <Button size="lg" type="button" onClick={this.onBtRegis} style={{ width: '100%', backgroundColor: '#0058AB' }}>Daftar</Button>
                    </div>
                </div>
            </Container>
        );
    }
}

const mapToProps = ({ authReducer }) => {
    return {
        id: authReducer.iduser
    }
}

export default connect(mapToProps, { authLogin })(AuthPage);
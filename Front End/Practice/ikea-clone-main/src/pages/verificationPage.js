import axios from 'axios';
import React, {useState} from 'react'
import { Jumbotron, Button, Input } from 'reactstrap';
import { URL_API } from '../helper';

const VerificationPage = (props) => {
    const [otp, setOtp] = useState('') 

    const handleOTP = (event) => {
        setOtp(event.target.value);
    };

    const verifOTP = async () => {
        try {
            const headers = {
                headers: {
                    'Authorization': `Bearer ${props.location.pathname.split("/")[2]}`
                }
            }
            await axios.patch(URL_API + `/users/verification`, {
                otp
            }, headers)

            // alert(response.data.message)
        } catch (error) {
            console.log(error)
        }
        // console.log('otp', otp)
        // axios.post(URL_API + `/users/verification`, {
        //     otp
        // })
        // .then(response =>{
        //     console.log(response.data)
        // })
        // .catch(error => {
        //     console.log(error)
        // })
    }

    console.log(props.location.pathname.split("/")[2])

    return (
        <div>
            <Jumbotron>
                <h1 className="display-3">Hello, please verif your email</h1>
                <p className="lead">Type OTP</p>
                <Input type='text' onChange={handleOTP} />
                <hr className="my-2" />
                <p className="lead">
                <Button color="primary" onClick={verifOTP}>Verif Account</Button>
                </p>
            </Jumbotron>
        </div>
    )
}

export default VerificationPage

import React from 'react'
import { Alert, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { URL_API } from '../helper';
import axios from 'axios';

const AlertVerification = ({email, password}) => {
    const getVerif = async () => {
        try {
            console.log('getverif', email, password)
            await axios.patch(URL_API + `/users/reverification`, {
                email, password
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <Alert color="warning">
                Please verification your email, by click <Button onClick={getVerif}>this link</Button>
            </Alert>
        </div>
    )
}

export default AlertVerification

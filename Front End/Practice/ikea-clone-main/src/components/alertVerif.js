import React from 'react'
import { Alert } from 'reactstrap';
import { Link } from 'react-router-dom';
import { URL_API } from '../helper';
import axios from 'axios';

const AlertVerification = ({email}) => {
    const getVerif = async () => {
        try {
            console.log('getverif', email)
            await axios.post(URL_API + `/users/reverification`, {
                email
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <Alert color="warning">
                Please verification your email first on this <Link to="/verification" onClick={getVerif} style={{ textDecoration: 'none', color: 'gray' }}>link</Link>
            </Alert>
        </div>
    )
}

export default AlertVerification

import React, { Component } from 'react';
import { Header } from 'react-native-elements';
import { Link } from 'react-router-native';

const HeaderComponent = (props) => {
    console.log('header username', props.username)
    return (
            <Link to="/logout" >
                <Header
                    containerStyle={{backgroundColor: 'purple'}}
                    leftComponent={{ icon: 'menu', color: 'white' }}
                    centerComponent={{ text: 'Hidayah', style: { color: 'white' } }}
                    rightComponent={{ text: props.username, style: { color: 'white' } }}
                />
            </Link>
    )
}

export default HeaderComponent
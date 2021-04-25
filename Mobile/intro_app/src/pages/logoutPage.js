import React, { Component, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from 'react-native-elements';
import { Redirect } from 'react-router-native';

const LogoutPage = (props) => {
    const [redirect, setRedirect] = useState(false)

    const Logout = async () => {
        try {
            console.log('logout')
            await AsyncStorage.removeItem('username');
            setRedirect(true)
        }
        catch(exception) {
            return false;
        }
    }

    if (redirect) {
        return (
            <Redirect to="/home" />
        )
    }

    return (
        <View style={{flex: 1, backgroundColor: 'purple', alignItems: 'center', justifyContent: 'center'}}>
            <Button title="Logout" 
                titleStyle={{color: 'purple'}}
                buttonStyle={{ backgroundColor: 'white'}}
                onPress={Logout}
            />
        </View>
    )
}

export default LogoutPage
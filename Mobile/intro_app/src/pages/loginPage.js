import React, { Component, useState } from 'react';
import { AsyncStorage, Image, Text, View } from 'react-native';
import HomePage from './homeFunc';
import { heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import { Input, Icon, Button } from 'react-native-elements';
import { Redirect } from 'react-router-native';

const LoginPage = (props) => {

    const [username, setUsername] = useState('')
    const [redirect, setRedirect] = useState(false)
    // console.log(username)

    const Login = () => {
        AsyncStorage.setItem('username', username, async (error) => {
            if (error) {
                console.log("error AsyncStorage",error)
            }
            let checkLogin = await AsyncStorage.getItem('username')
            console.log("check login", checkLogin)
            setRedirect(true)
        })
    }

    if (redirect) {
        return (
            <Redirect to="/home" />
        )
    }

    return (
        <View style={{flex: 1, backgroundColor: 'purple', alignItems: 'center', justifyContent: 'center'}}>
            <Image source={{uri: "https://cdn.pixabay.com/photo/2020/11/01/04/30/youtube-5702853_1280.png"}} 
                style={{height: hp('20%'), width: wp("50%")}}    
            />
            <View style={{width: wp("80%")}} >
                <Input 
                    leftIcon = {
                        <Icon
                        name="user"
                        size={24}
                        type="feather"
                        color="white"
                        />
                    }
                    placeholder="Username"
                    placeholderTextColor="white"
                    style={{color: 'white'}}
                    onChangeText = {e => setUsername(e)}
                />
                <Button title="Sign In" 
                    titleStyle={{color: 'purple'}}
                    buttonStyle={{ backgroundColor: 'white'}}
                    onPress={Login}
                />
            </View>
        </View>
    )
}

export default LoginPage
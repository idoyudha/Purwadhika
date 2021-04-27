import React, { useEffect, useState } from 'react';
import { Button, Icon, Input } from 'react-native-elements'
import { View, Text, Image } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux'
import { getUsers, onLogin } from '../actions'
import { Alert } from 'react-native';
import { StackActions } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPage = (props) => {
    // useDispatch : digunakan untuk menjalankan fungsi dari actions, pengganti connect pada class component
    const dispatch = useDispatch()

    // useState : menyimpan data pada state
    const [loginForm, setLogin] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    // useEffect : pengganti componentDidMount
    // useEffect(async() => {
    //     // // menjalankan fungsi action
    //     // dispatch(getUsers())
    //     // AsyncStorage.removeItem('id_tkn')
    // }, [])
    setTimeout(() => setLogin(true), 3000)
    
    // useSelctor : pengganti mapStateToProps pada class component
    const { iduser } = useSelector(({ userReducer }) => {
        return {
            iduser: userReducer.id
        }
    })
    
    // useEffect : pengganti componentDidUpdate
    useEffect(() => {
        console.log("data dari reducer :", iduser)
        if (iduser) {
            // page login yg awalnya menjadi page pertama, digantikan oleh page home
            props.navigation.dispatch(StackActions.replace("TabNav"))
        }
    })

    const btLogin = () => {
        if (username == '' || password == '') {
            Alert.alert('Fill in the form')
        } else {
            dispatch(onLogin(username, password))
        }
    }

    if (loginForm) {
        return (
            <>
                <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={{ uri: "https://ezc.partners/wp-content/uploads/2020/04/ikea-logo.jpg" }} style={{ width: wp('60%'), height: hp('10%') }} />
                    <View style={{ width: wp(70), alignItems: 'center', margin: hp(5) }}>
                        <Input placeholder="username"
                            onChangeText={val => setUsername(val)}
                            leftIcon={
                                <Icon name="user" type="feather" size={22} />
                            } />
                        <Input placeholder="Password"
                            onChangeText={val => setPassword(val)}
                            leftIcon={
                                <Icon name="lock" type="feather" size={22} />
                            } secureTextEntry />
                        <Button title="Sign In"
                            onPress={btLogin} containerStyle={{ width: wp(30) }} />
                    </View>
                </View>
                <Text style={{ backgroundColor: 'white', textAlign: 'center', padding: hp(1) }}>Not have account ?
                <Text style={{ color: 'skyblue', fontWeight: 'bold' }} onPress={() => props.navigation.navigate("Regis")}>Regis Now</Text> </Text>
            </>
        )
    }
    // splashscreen
    return (
        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
            <Image source={{ uri: "https://ezc.partners/wp-content/uploads/2020/04/ikea-logo.jpg" }} style={{ width: wp('60%'), height: hp('10%') }} />
        </View>
    );
}

export default LoginPage
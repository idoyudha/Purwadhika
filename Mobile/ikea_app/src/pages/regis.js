import React, { useEffect, useState } from 'react';
import { Button, Icon, Input } from 'react-native-elements'
import { View, Text, Image } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux'
import { getUsers, onRegis } from '../actions'
import { Alert } from 'react-native';
import { StackActions } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisPage = (props) => {
    // useDispatch : digunakan untuk menjalankan fungsi dari actions, pengganti connect pada class component
    const dispatch = useDispatch()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confpassword, setConfPassword] = useState('')

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
            props.navigation.reset({
                index: 0,
                routes: [{ name: 'TabNav' }],
              })
        }
    })

    const btRegis = () => {
        if (username == '' || password == '') {
            Alert.alert('Fill in the form')
        } else {
            dispatch(onRegis(username, email, password, confpassword))
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'skyblue', fontWeight: 'bold' }}>Create Account</Text>
            <View style={{ width: wp(70), alignItems: 'center', margin: hp(5) }}>
                <Input placeholder="Username"
                    onChangeText={val => setUsername(val)}
                    leftIcon={
                        <Icon name="user" type="feather" size={22} />
                    } />
                <Input placeholder="Email"
                    onChangeText={val => setEmail(val)}
                    leftIcon={
                        <Icon name="mail" type="feather" size={22} />
                    } />
                <Input placeholder="Password"
                    onChangeText={val => setPassword(val)}
                    leftIcon={
                        <Icon name="lock" type="feather" size={22} />
                    } secureTextEntry />
                <Input placeholder="Confirm. Password"
                    onChangeText={val => setConfPassword(val)}
                    leftIcon={
                        <Icon name="lock" type="feather" size={22} />
                    } secureTextEntry />
                <Button title="Sign Up"
                    onPress={btRegis} containerStyle={{ width: wp(30) }} />
            </View>
        </View>
    )

}

export default RegisPage;
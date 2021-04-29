import axios from 'axios';
import React from 'react';
import { View, FlatList } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useSelector, useDispatch } from 'react-redux';
import CardCart from '../components/cardCart';
import { createLocalNotification, notifConfiguration, URL_API } from '../helper';
import { updateCart } from '../actions/userAction';

const CartPage = (props) => {
    const { cart, idUser, username } = useSelector(({ userReducer }) => {
        // console.log("Check data from reducer", productReducer.product_list)
        return {
            cart: userReducer.cart,
            idUser: userReducer.id,
            username: userReducer.username
        }
    })

    const dispatch = useDispatch()

    const totalPayment = () => {
        let total = 0;
        cart.forEach(item => {
            total += item.subTotal
        })
        return total
    }

    const checkout = () => {
        // data: iduser, username, data, status, total, detail 
        let total = totalPayment()
        let date = new Date()
        console.log('checkout', idUser, username, total, cart)
        axios.post(URL_API + `/userTransaction`,{
            idUser, 
            username, 
            date_transaction: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
            cart, 
            total, 
            status: 'unpaid'
        })
        .then(response => {
            console.log("Response:", response.data)
            axios.patch(URL_API + `/users/${idUser}`,{
                cart: []
            })
            .then(response => {
                console.log("Response:", response.data)
                dispatch(updateCart(response.data.cart))
                notifConfiguration(() => props.navigation.navigate("Transaction"))
                createLocalNotification("X1", "Checkout", "Your order will be processed after payment")
                props.navigation.navigate("Profile")
            }).catch(error => {
                console.log("Error:", error)
            })
        }).catch(error => {
            console.log("Error:", error)
        })
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: hp(3.5) }}>
            <FlatList
                data={cart}
                renderItem={({ item, index }) => (
                    <CardCart idx={index} data={item} />
                )}
                keyExtractor={(item, index) => index.toString()}
                style={{ marginTop: wp(2) }}
            />
            <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', padding: wp(2) }}>
                <View>
                    <Text>Total Payment</Text>
                    <Text h4>IDR. {totalPayment()}</Text>
                </View>
                <Button
                    title="Checkout"
                    containerStyle={{ width: wp('40%') }}
                    buttonStyle={{ backgroundColor: '#FBD914' }}
                    titleStyle={{ color: '#0058AB' }}
                    onPress = {checkout}
                />
            </View>
        </View>
    )
}

export default CartPage
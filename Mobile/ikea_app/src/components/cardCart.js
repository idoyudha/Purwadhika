import React from 'react';
import { useSelector } from 'react-redux'
import { Body, Card, CardItem, Left, Right, Thumbnail } from 'native-base';
import { Text, Button, Icon } from 'react-native-elements';
import axios from 'axios';
import { URL_API } from '../helper';
import { useDispatch } from 'react-redux';
import { updateCart } from '../actions/userAction';

const CardCart = ({ data, idx }) => {

    // take data from global store reducer
    const { cart, iduser } = useSelector(({ userReducer }) => {
        return {
            cart: userReducer.cart,
            iduser: userReducer.id
        }
    })

    const dispatch = useDispatch()

    const onBtnQty = (type, index) => {
        if (cart[index].qty < 0) {
            alert('Cant be zero')
        }
        else {
            if (type == "inc") {
                cart[index].qty += 1  
                // console.log('cart', cart[index])
            }
            else if (type == "dec") {
                cart[index].qty -= 1
                // console.log('cart', cart[index])
            }
            cart[index].subTotal = cart[index].qty * cart[index].harga
            axios.patch(URL_API + `/users/${iduser}`,{
                cart: cart
            })
            .then(response => {
                console.log("Response:", response.data)
                dispatch(updateCart(response.data.cart))
            }).catch(error => {
                console.log("Error:", error)
            })
        }
    }

    return (
        <Card>
            <CardItem>
                <Left>
                    <Thumbnail source={{ uri: data.image }} />
                    <Body>
                        <Text>{data.nama}</Text>
                        <Text>IDR. {data.subTotal}</Text>
                    </Body>
                </Left>
                <Right style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                    <Button type="outline" icon={
                        <Icon type="feather" name="minus" size={15} 
                        onPress = {() => onBtnQty("dec", idx)}/>} 
                        />
                    <Text h4 style={{ marginHorizontal: 10 }}>{data.qty}</Text>
                    <Button type="outline" icon={
                        <Icon type="feather" name="plus" size={15} 
                        onPress = {() => onBtnQty("inc", idx)}/>
                    } />
                </Right>
            </CardItem>
        </Card>
    )
}

export default CardCart
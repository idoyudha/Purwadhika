import React, { useEffect, useState, Component } from 'react'
import { Text, Overlay } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { URL_API } from '../helper';
import { View, Button } from 'react-native';
import axios from 'axios';
import { Body, Card, CardItem, Left, Right, Thumbnail, Container, Header, Content, Icon } from 'native-base';

const TransactionPage = () => {

    const [total, setTotal] = useState('') 
    const [date, setDate] = useState('') 
    const [status, setStatus] = useState('') 
    const [cart, setCart] = useState(undefined) 

    const { username, data } = useSelector(({ userReducer, productReducer }) => {
      // console.log("Check data from reducer", productReducer.product_list)
      return {
          username: userReducer.username,
          data: productReducer.product_list
      }
    })
    
    const [visible, setVisible] = useState(false);

    const toggleOverlay = () => {
      setVisible(!visible);
    };

    useEffect(() => {
      printTransaction()
    }, [])

    const printTransaction = () => {
      axios.get(URL_API + `/userTransaction?username=${username}`)
      .then(response => {
        console.log('Get cart transaction', response.data[0].cart)
        setStatus(response.data[0].status)
        setTotal(response.data[0].total)
        setDate(response.data[0].date_transaction)
        setCart(response.data[0].cart)
      })
      .catch(error => {
        console.log(error)
      })
    }
    
    const printCart = () => {
      // console.log('Listprod', cart)
      if (cart !== undefined) {
        return cart.map((item, index) => {
          return <Card>
                    <CardItem>
                      <Thumbnail source={{ uri: item.image }} />
                      <Text>{item.nama} | </Text>
                      <Text>IDR. {item.subTotal} | </Text>
                      <Text h4 style={{ marginHorizontal: 10 }}>{item.qty}</Text>
                    </CardItem>
                  </Card>
          })
      }
    }

    const pay = () => {
      // console.log('bayar', cart)
      // console.log('prod', data)
      let idFound = []
      data.forEach(eData => {
        cart.forEach(eCart => {
          console.log('id', eData.nama, eCart.nama)
          if (eData.nama === eCart.nama) {
            idFound.push(eData.id)
            eData.qty -= eCart.qty 
            eCart.status = "PAID"
          }
        });
      });
      // for (i = 0; i < data.length; i++) {
      //   for (j = 0; j < cart.length; j++) {
      //     if (data[i].id === cart[j].id)
      //     idFound.push(data[i].id)
      //   }
      // }
      console.log('idFound', idFound)
    }

    return (
        <>
          <Text h4>Transaction Page | {username}</Text>
          <View style={{ flex: 1, backgroundColor: 'white', justifyContent: "space-between", paddingTop: hp(3.5) }}>
            <CardItem>
                  <Left>
                      <Text>{date}</Text>
                      <Body>
                          <Text>Total Payment</Text>
                          <Text>IDR. {total}</Text>
                          <Text>{status}</Text>
                      </Body>
                  </Left>
                  <Right style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Button
                      onPress={toggleOverlay}
                      title="Detail"
                      color="#841584"
                      accessibilityLabel="Learn more about this purple button"
                    />
                  </Right>
              </CardItem>
            <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', padding: wp(2) }}>
                <View>
                    <Text>Total Payment</Text>
                    <Text h4>IDR. {total}</Text>
                </View>
                <Button
                    title="PAY"
                    containerStyle={{ width: wp('40%') }}
                    buttonStyle={{ backgroundColor: '#FBD914' }}
                    titleStyle={{ color: '#0058AB' }}
                    onPress = {pay}
                />
            </View>
          </View>
          <View>
            <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
              {printCart()}
            </Overlay>
          </View>
        </>
    )
}

export default TransactionPage

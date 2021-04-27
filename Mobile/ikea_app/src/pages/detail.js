import React, { useState } from 'react';
import { Container, Header, Content, Form, Item, Picker, CardItem } from 'native-base';
import { Image, View, FlatList, Alert } from 'react-native';
import { Button, Card, Text, Icon, Input, Overlay } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from 'axios';
import { URL_API } from '../helper'
import { updateCart } from '../actions/userAction';
export default (props) => {
    const { detail } = props.route.params

    const [selected, setSelected] = useState(`${detail.stock[0].type}-${detail.stock[0].qty}`)
    const [visible, setVisible] = useState(false);
    const [qty, setQty] = useState('');

    // ambil data dari select options
    const onValueChange = (value) => {
        console.log(value)
        setSelected(value);
    }

    // fungsi buka tutup modal / overlay
    const toggleOverlay = () => {
        setVisible(!visible);
    };

    // fungsi tambah barang ke cart
    const onBtAddToCart = () => {
        // console.log(selected)
        if (parseInt(qty) > parseInt(selected.split('-')[1])) { // L-12 split by "-" --> ["L","12"]
            Alert.alert('Qty melebihi stock')
        } else {
            // fungsi patch
            cart.push({
                nama: detail.nama,
                type: selected.split('-')[0],
                image: detail.images[0],
                qty: parseInt(qty),
                harga: detail.harga,
                subTotal: parseInt(qty) * parseInt(detail.harga),
            })
            console.log(cart)
            axios.patch(URL_API + `/users/${iduser}`, { cart })
                .then(res => {
                    console.log("Add to cart success", res.data)
                    dispatch(updateCart(res.data.cart))
                    setVisible(!visible)
                    props.navigation.navigate("Cart")
                }).catch(err => {
                    console.log(err)
                })
        }
    }

    const dispatch = useDispatch()
    const { iduser, cart } = useSelector(({ userReducer }) => {
        return {
            iduser: userReducer.id,
            cart: userReducer.cart
        }
    })
    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <View style={{ height: hp("50%"), width: wp("100%") }}>
                <FlatList
                    data={detail.images}
                    renderItem={({ item }) => (
                        <Image source={{ uri: item }} style={{ height: hp(50), width: wp(100) }} />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <Overlay isVisible={visible} onBackdropPress={toggleOverlay} >
                <Input keyboardType="numeric" placeholder="Masukkan jumlah barang" containerStyle={{ width: wp(75) }}
                    onChangeText={value => setQty(value)}
                />
                <Button icon={
                    <Icon
                        name="plus-square"
                        type="feather"
                        size={20}
                        color="#FBD914"
                        containerStyle={{ marginHorizontal: wp(2) }}
                    />
                }
                    type="clear"
                    onPress={onBtAddToCart}
                    containerStyle={{ width: wp(50), alignSelf: 'center' }} titleStyle={{ color: '#FBD914' }}
                    title="Tambahkan" />
            </Overlay>
            <View style={{ flex: 1, alignItems: 'center', marginTop: hp("-8%") }}>
                <Card containerStyle={{ flex: 1, borderTopRightRadius: 30, borderTopLeftRadius: 30, width: wp(100) }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold", color: 'gray', textAlign: 'right' }}>{detail.kategori}</Text>
                    <Text h3>{detail.nama}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {/* <Text h4>Stock : {detail.stok}</Text> */}
                        <Text style={{ fontWeight: "bold", color: '#0058AB', fontSize: 25 }}>IDR. {detail.harga}</Text>
                    </View>
                    <Text style={{ borderBottomWidth: 0.5, borderBottomColor: 'gray', color: 'gray', marginTop: hp(2) }}>Deskripsi</Text>
                    <Text style={{ textAlign: 'justify', marginVertical: 10 }}>{detail.deskripsi}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ width: wp(40), borderBottomWidth: 0.5, borderBottomColor: 'gray', color: 'gray', marginTop: hp(1) }}>Tipe</Text>
                        <Form>
                            <Item picker>
                                <Picker
                                    mode="dialog"
                                    // iosIcon={<Icon name="arrow-down" />}
                                    style={{ width: wp(50), height: hp(5) }}
                                    placeholder="Pilih tipe"
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={selected}
                                    onValueChange={onValueChange}
                                >
                                    {detail.stock.map((item, index) => {
                                        return <Picker.Item label={`${item.type} Stock : ${item.qty}`} value={`${item.type}-${item.qty}`} />
                                    })}
                                </Picker>
                            </Item>
                        </Form>
                    </View>
                </Card>
            </View>
            <Button icon={
                <Icon
                    name="shopping-cart"
                    type="feather"
                    size={15}
                    color="#FBD914"
                    containerStyle={{ marginHorizontal: wp(4) }}
                />
            }
                onPress={toggleOverlay}
                containerStyle={{ width: wp(100), alignSelf: 'center', backgroundColor: '#0058AB' }} titleStyle={{ color: '#FBD914' }}
                title="Add to cart" />
        </View>
    );
}

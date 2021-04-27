import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, FlatList, ImageBackground,TouchableWithoutFeedback } from 'react-native';
import { Header, Icon, SearchBar } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { URL_API } from '../helper'
import CardProducts from '../components/card'

const style = StyleSheet.create({
    searchBar: {
        width: wp('60%'),
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
        borderTopWidth: 0,
        padding: 0,
        marginLeft: wp(-5)
    },
    inputSearch: {
        height: hp(5),
        backgroundColor: 'white'
    }
})
const HomePage = (props) => {

    const [banner, setBanner] = useState([])
    const [products, setProducts] = useState([])

    useEffect(() => {
        getBanner()
        getProducts()
    }, [])

    const getBanner = () => {
        axios.get(URL_API + `/banner`)
            .then(res => {
                console.log("banner ==>", res.data)
                setBanner(res.data)
            }).catch(err => {
                console.log(err)
            })
    }

    const getProducts = () => {
        axios.get(URL_API + `/products`)
            .then(res => {
                console.log("products ==>", res.data)
                setProducts(res.data)
            }).catch(err => {
                console.log(err)
            })
    }

    const renderProducts = () => {
        return products.map((e, index) => {
            return (
                // <TouchableWithoutFeedback key={index}>
                    <View style={{ width: wp('50%') }}>
                        <CardProducts name={e.nama} image={e.images[0]} price={e.harga} btDetail={() => props.navigation.navigate('Detail', { detail: e })}/>
                    </View>
                // </TouchableWithoutFeedback>
            )
        })
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Header
                placement="left"
                centerComponent={
                    <SearchBar
                        placeholder="Search Product"
                        containerStyle={style.searchBar}
                        inputContainerStyle={style.inputSearch}
                    />
                }
                rightComponent={
                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                        <Icon name="heart" type="feather" size={24}
                            iconStyle={{ color: 'white' }} style={{ marginHorizontal: wp(2) }} />
                        <Icon name="message-circle" type="feather" size={24}
                            iconStyle={{ color: 'white' }} style={{ marginHorizontal: wp(2) }} />
                        <Icon name="bell" type="feather" size={24}
                            iconStyle={{ color: 'white' }} style={{ marginHorizontal: wp(2) }} />
                    </View>
                }
            />
            <ScrollView style={{ backgroundColor: 'white', flex: 1 }}>
                <View>
                    <FlatList
                        data={banner}
                        renderItem={({ item }) => (
                            <ImageBackground source={{ uri: item }} style={{ width: wp(90), height: hp(25) }} />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                <>
                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                        {/* FUngsi render product */}
                        {renderProducts()}
                    </View>
                </>
            </ScrollView>
        </View>
    )
}

export default HomePage
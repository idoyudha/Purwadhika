import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, ImageBackground } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon, Avatar, Accessory } from 'react-native-elements';
import { authLogout } from '../actions';
import { useDispatch, useSelector } from 'react-redux';


const ProfilePage = (props) => {
  const DATA = [
      {
        id: '1',
        title: 'Change Profile',
        icon: 'user',
        action: [],
      },
      {
        id: '2',
        title: 'Transaction',
        icon: 'shopping-cart',
        action: () => props.navigation.navigate("Transaction"),
      },
      {
        id: '3',
        title: 'Logout',
        icon: 'log-out',
        action: () => dispatch(authLogout()),
      },
  ];
  
  const ABOUT = [
      {
        id: '1',
        title: 'Settings',
        icon: 'settings',
        action: [],
      },
      {
        id: '2',
        title: 'Privacy and Policy',
        icon: 'key',
        action: [],
      }
  ];
  
  
  const Item = ({ title, icon, action }) => (
    <View style={styles.item}>
      <Icon name={icon} type="feather" size={24} iconStyle={{ color: '#000080' }} />
      <Text style={styles.title}>{title}</Text>
      <Icon name="arrow-right" type="feather" 
      style={{ height: hp(5), justifyContent: 'flex-end', marginTop: hp(-2) }}
      size={20} onPress={action}/>
    </View>
  );
  
  const dispatch = useDispatch()
    const [picture, setPicture] = useState("https://ohmy.disney.com/wp-content/uploads/2014/10/Q3-Jack-Sparrow.png")
    const { iduser, username } = useSelector(({ userReducer }) => {
        return {
            iduser: userReducer.id,
            username: userReducer.username
        }
    })

    const redirect = (page, action) => {
        dispatch(action)
        props.navigation.navigate(page)
    }

    const renderItem = ({ item }) => (
        <Item title={item.title} icon={item.icon} action={item.action}/>
    );

    useEffect(() => {
        console.log(iduser)
        if (!iduser) {
          props.navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
          })
        }
    })

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ height: hp("40%"), width: wp("100%") }}>
                <ImageBackground source={{ uri: "https://gizmologi.id/wp-content/uploads/2021/01/Ethereum-123rf-rclassenlayouts.jpg" }} style={{ height: hp(40), width: wp(100) }}>
                <Avatar
                  rounded
                  containerStyle={{ alignSelf: 'center', marginTop: "25%" }}
                  size={80}
                  source={{
                    uri: picture,
                  }}
                >
                  <Avatar.Accessory name="edit"
                    type="feather"
                    size={25}
                  />
                </Avatar>
                <Text style={{ fontSize: 25, marginTop: 10, alignSelf: 'center', color: 'white' }}>{username}</Text>
                </ImageBackground>
            </View>
        <View>
            <Text style={{marginLeft: wp(5), fontWeight: '700', color: '#000080', fontSize: 18}}>Account</Text>
            <FlatList
                data={DATA}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
        <View>
            <Text style={{marginLeft: wp(5), fontWeight: '700', color: '#000080', fontSize: 18}}>About</Text>
            <FlatList
                data={ABOUT}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
        </SafeAreaView>
        
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    item: {
      backgroundColor: '#fff',
      padding: 20,
      marginVertical: 1,
      marginHorizontal: 1,
      display: 'flex',
      flexDirection: 'row',
    },
    title: {
      fontSize: 15,
      color: '#000080',
      marginHorizontal: 9,
    },
  });

export default ProfilePage
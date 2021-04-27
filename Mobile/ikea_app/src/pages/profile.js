import React, { useEffect } from 'react';
import { Image, SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { authLogout } from '../actions';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions, useNavigation  } from '@react-navigation/native';


const DATA = [
    {
      id: '1',
      title: 'Change Profile',
      icon: 'user',
      page: 'Profile',
      action: [],
    },
    {
      id: '2',
      title: 'Transaction',
      icon: 'shopping-cart',
      page: 'Transaction',
      action: [],
    },
    {
      id: '3',
      title: 'Logout',
      icon: 'log-out',
      page: 'Login',
      action: authLogout(),
    },
];

const ABOUT = [
    {
      id: '1',
      title: 'Settings',
      icon: 'settings',
      page: 'Settings',
      action: [],
    },
    {
      id: '2',
      title: 'Privacy and Policy',
      icon: 'key',
      page: 'Privacy',
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

const ProfilePage = (props) => {
    const dispatch = useDispatch()

    const { iduser } = useSelector(({ userReducer }) => {
        return {
            iduser: userReducer.id
        }
    })

    const redirect = (page, action) => {
        dispatch(action)
        props.navigation.navigate(page)
    }

    const renderItem = ({ item }) => (
        <Item title={item.title} icon={item.icon} action={() => redirect(item.page, item.action)}/>
    );

    useEffect(() => {
        console.log(iduser)
    })

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ height: hp("40%"), width: wp("100%") }}>
                <Image source={{ uri: "https://gizmologi.id/wp-content/uploads/2021/01/Ethereum-123rf-rclassenlayouts.jpg" }} style={{ height: hp(40), width: wp(100) }} />
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
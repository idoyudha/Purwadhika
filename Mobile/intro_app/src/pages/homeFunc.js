import axios from 'axios';
import { Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { AsyncStorage, ScrollView, View } from 'react-native';
import HeaderComponent from '../components/header';
import { URLAPI, APIKey } from '../../helper';
import Post from '../components/card'
import { Link } from 'react-router-native';

const HomePage = (props) => {

    // Single state
    const [news, setNews] = useState([])
    const [redirect, setRedirect] = useState(false)

    // Multi state 
    const [data, setData] = useState({
        news: [],
        redirect: false,
        username: ''
    })

    useEffect(() => {
        getNews()
        getUsername()
    }, []) // componentDidMount

    const getNews = async() => {
        try {
            let get = await axios.get(URLAPI+`/top-headlines?sources=techcrunch&apiKey=${APIKey}`)
            // console.log('data from api async', get.data)
            // setNews(get.data.articles)

            // Multiple state
            setData({ ...data, news: get.data.articles})
        }
        catch (error) {
            console.log(error)
        }
    }
    const getUsername = async () => {
        try {
            const value = await AsyncStorage.getItem('username')
            console.log('value', value)
            if(value !== null) {
                setData({ ...data, username: value})
            }
        } 
        catch(e) {
            console.log(e)
        }
    }

    const renderNews = () => {
        console.log('username', data.username)
        return data.news.map((item, index) => {
            return  <Post title={item.title} author={item.author} time={item.publishedAt} description={item.description} image={item.urlToImage}></Post>
        })
    }

    return (
        <View>
            <HeaderComponent username={data.username}/>
            <Text>Home with Functional</Text>
            <ScrollView>
                {renderNews()}
            </ScrollView>
        </View>
    )
}

export default HomePage
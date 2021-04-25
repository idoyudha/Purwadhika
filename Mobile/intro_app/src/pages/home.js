import axios from 'axios';
import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { Text, ThemeProvider, Header } from 'react-native-elements';
import { URLAPI, APIKey } from '../../helper';
import HeaderComponent from '../components/header';
import Post from '../components/card'
import SearchBarComponent from '../components/searchbar';
import { Link } from 'react-router-native';

const URL = 'https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=73b0b19c85574f7aafe911b8a9478f35'


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            news: []
        }
    }

    componentDidMount() {
        // this.fetchNews()
        this.fetchNewsAsync()
    }

    // syncronus
    fetchNews = () => {
        axios.get(URLAPI+`/top-headlines?sources=techcrunch&apiKey=${APIKey}`)
        .then(response => {
            console.log('data from api news',response.data)
            this.setState({news: response.data.articles})
        })
        .catch(error => {
            console.log(error)
        })
    }

    fetchNewsAsync = async () => {
        try {
            let get = await axios.get(URLAPI+`/top-headlines?sources=techcrunch&apiKey=${APIKey}`)
            console.log('data from api async', get.data)
            this.setState({news: get.data.articles})
        } catch (error) {
            console.log(error)
        }
    }

    printCard = () => {
        let data = this.state.news
        console.log('print data', data)
        return data.map((item, index) => {
            return  <Link to={{
                        pathname: "/detail-news",
                        search: `?sort=${item.title}`,
                        state:  {title: item.title,
                                author: item.author,
                                images:item.urlToImage,
                                time:item.publishedAt,
                                description:item.description
                            }
                        }}>
                        <Post title={item.title} author={item.author} time={item.publishedAt} description={item.description} image={item.urlToImage}/>
                    </Link>
        })      
    }


    render() {
        console.log('state news',this.state.news)
        return (  
            <View style={{backgroundColor: 'gray', flex: 1}}>
                <HeaderComponent />
                <ScrollView>
                <SearchBarComponent />
                {this.printCard()}
                </ScrollView>
            </View>
        );
    }
}
 
export default Home;
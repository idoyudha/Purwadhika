import axios from 'axios';
import React, { Component } from 'react';
import { Text, View } from 'react-native';

const URL = 'https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=73b0b19c85574f7aafe911b8a9478f35'

class TextComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            articles: ''
        }
    }

    componentDidMount() {
        this.fetchNews()
    }

    fetchNews = () => {
        axios(URL)
        .then(response => {
            // console.log('Fetch data', response.data)
            // this.setState({articles: response.data.articles})
            let data = response.data.articles
            console.log('printstate',data[0])
            // return data[0].map((item, index) => {
            //     return  <View>
            //                 <Text>{item.author}</Text>
            //                 <Text>{item.title}</Text>
            //                 <Text>{item.description}</Text>
            //                 <Text>{item.publishedAt}</Text>
            //             </View>
            // })
        })
        .catch(error => 
            console.log(error)
        )
    }

    printData = () => {
        let data = this.state.articles
        console.log('printstate',data[0])
        return data[0].map((item, index) => {
            return  <View>
                        <Text>{item.author}</Text>
                        <Text>{item.title}</Text>
                        <Text>{item.description}</Text>
                        <Text>{item.publishedAt}</Text>
                    </View>
        })
    }

    printDataX = () => {
        let data = this.state.articles
        console.log('printstate',data[0])
        // return  <View>
        //             <Text>{data[0].author}</Text>
        //         </View>
    }

    render() {
        return (
            <View>
                <Text>{URL}</Text>
                {this.fetchNews}
            </View>
        );
    }
}
 
export default TextComponent;
import React, { Component } from 'react';
import { Image } from 'react-native';
import { ScrollView, Text, View } from 'react-native';

class DetailNews extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            data: []
        }
    }
    render() { 
        console.log('detail', this.props.location.state)
        return (  
            <ScrollView>
                <Text>{this.props.location.state.title}</Text>
                <Text>{this.props.location.state.author}</Text>
                <Image source={{uri: this.props.location.state.images }} style={{height: 200, width: null, flex: 1}}/>
                <Text>{this.props.location.state.time}</Text>
                <Text>{this.props.location.state.description}</Text>
            </ScrollView>
        );
    }
}
 
export default DetailNews;
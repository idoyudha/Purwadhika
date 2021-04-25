import { Body, Card, CardItem, Left, Thumbnail, Text } from 'native-base';
import React, { Component } from 'react'; 
import { Image } from 'react-native';
import { Link } from 'react-router-native';

export default (props) => {
    return (
        <Card>
            <CardItem>
                <Left>
                    <Thumbnail source={{uri: "https://cdn.pixabay.com/photo/2020/11/01/04/30/youtube-5702853_1280.png"}}/>
                    <Body>
                        <Text>{props.title}</Text>
                        <Text>{props.author}</Text>
                    </Body>
                </Left>
            </CardItem>
            <CardItem cardBody>
                <Image source={{uri: props.image }} style={{height: 200, width: null, flex: 1}}/>
            </CardItem>
            <CardItem>
                <Body>
                    <Text>{props.time}</Text>
                    <Text>{props.description}</Text>
                </Body>
            </CardItem>
        </Card>
    )
}
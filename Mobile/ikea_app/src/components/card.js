import { Card, CardItem, Left, Right } from 'native-base';
import React from 'react';
import { Image, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

let defaultImage = "https://zirang.co.id/wp-content/plugins/carousel-horizontal-posts-content-slider/assets/images/default-image.jpg"
export default (props) => {
    return (
        <Card>
            <CardItem cardBody>
                <Image source={{ uri: props.image.length > 0 ? props.image : defaultImage }} style={{ height: 175, width: null, flex: 1 }} />
            </CardItem>
            <CardItem style={{ height: hp(5) }}>
                <Text style={{ fontSize: 12 }}>{props.name}</Text>
            </CardItem>
            <CardItem style={{ height:hp(5)}}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: hp(-2) }}>IDR. {props.price.toLocaleString()}</Text>
            </CardItem>
            <CardItem style={{ height: hp(5), justifyContent: 'flex-end', marginTop: hp(-2) }}>
                <Icon name="more-horizontal" type="feather" size={20} onPress={props.btDetail}/>
            </CardItem>
        </Card>
    )
}
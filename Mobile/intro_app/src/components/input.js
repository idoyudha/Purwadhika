import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import { View } from 'react-native';

class InputComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return (  
            <View>
                <Input
                placeholder='BASIC INPUT'
                />

                <Input
                placeholder='INPUT WITH ICON'
                leftIcon={{ type: 'font-awesome', name: 'chevron-left' }}
                />

                <Input
                placeholder='INPUT WITH CUSTOM ICON'
                leftIcon={
                    <Icon
                    name='user'
                    size={24}
                    color='black'
                    />
                }
                />

                <Input
                placeholder="Comment"
                leftIcon={{ type: 'font-awesome', name: 'comment' }}
                onChangeText={value => this.setState({ comment: value })}
                />


                <Input
                placeholder='INPUT WITH ERROR MESSAGE'
                errorMessage='ENTER A VALID ERROR HERE'
                />

                <Input placeholder="Password" secureTextEntry={true} />
            </View>
        );
    }
}
 
export default InputComponent;


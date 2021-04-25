import React, { Component } from 'react';
import { View } from 'react-native';
import { SearchBar } from 'react-native-elements';

class SearchBarComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            search: ''
        }
    }

    updateSearch = (search) => {
        this.setState({ search });
    };

    render() {
        const { search } = this.state;
        return (
            <View>
                <SearchBar
                    placeholder="Type Here..."
                    onChangeText={this.updateSearch}
                    value={search}
                />
            </View>
        );
    }
}
 
export default SearchBarComponent;
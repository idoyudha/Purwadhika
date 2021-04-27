import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomePage from '../pages/home'
import CartPage from '../pages/cart'
import ProfilePage from '../pages/profile'
import { Icon } from 'react-native-elements';
const Tab = createBottomTabNavigator()

const TabNavigation = (props) => {
    return (
        <Tab.Navigator initialRouteName="Home"
            screenOptions={
                ({ route }) => ({
                    tabBarIcon: ({ color }) => {
                        let iconName;
                        if (route.name == "Home") {
                            iconName = "home"
                        } else if (route.name == "Cart") {
                            iconName = "shopping-bag"
                        } else if (route.name == "Profile") {
                            iconName = "user"
                        }
                        return <Icon type="feather" name={iconName} size={18} color={color} />
                    }
                })
            }

            tabBarOptions={{
                showLabel: false
            }}
        >
            <Tab.Screen name="Home" component={HomePage} />
            <Tab.Screen name="Cart" component={CartPage} />
            <Tab.Screen name="Profile" component={ProfilePage} />
        </Tab.Navigator>
    )
}

export default TabNavigation
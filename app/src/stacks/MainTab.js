import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import Home from '../screens/Home';
import Search from '../screens/Search';
import Appointments from '../screens/Appointments';
import Favorites from '../screens/Favorites';
import Profile from '../screens/Profile';
import CustomTabBar from '../components/CustomTabBar';

const Tab = createBottomTabNavigator();

export default () => (
    <Tab.Navigator tabBar={ props => <CustomTabBar { ...props } /> } >
        <Tab.Screen name="Home" component={Home} options={ { unmountOnBlur: true } }/>
        <Tab.Screen name="Search" component={Search} options={ { unmountOnBlur: true } }/>
        <Tab.Screen name="Appointments" component={Appointments} />
        <Tab.Screen name="Favorites" component={Favorites} options={ { unmountOnBlur: true } } />
        <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
);
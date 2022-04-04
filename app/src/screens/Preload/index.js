import React, { useEffect, useContext } from 'react';
import { Container, LoadingIcon } from './styles';
import BarberLogo from '../../assets/barber.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../contexts/UserContext';
import Api from '../../Api';

export default () => {
    const { dispatch: userDispatch } = useContext(UserContext);
    const navigation = useNavigation();

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('token');

            if (token) {
                try {
                    let res = await Api.checkToken(token);

                    if (res.token) {
                        await AsyncStorage.setItem('token', res.token);

                        userDispatch({
                            type: 'setId',
                            payload: {
                                id: res.data.id
                            }
                        });

                        userDispatch({
                            type: 'setAvatar',
                            payload: {
                                avatar: res.data.avatar
                            }
                        });

                        navigation.reset({
                            routes: [
                                { name: 'MainTab' }
                            ]
                        });
                    } else {
                        navigation.navigate('SignIn');
                    }
                } catch (error) {
                    alert("ERROOOOO : "+ error);
                }
            } else {
                navigation.navigate('SignIn');
            }
        };

        checkToken();
    }, []);

    return (
        <Container>
            <BarberLogo width="100%" height="160" />
            <LoadingIcon size="large" color="#FFFFFF" />
        </Container>
    );
};
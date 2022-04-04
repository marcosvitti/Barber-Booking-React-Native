import React, { useContext } from 'react';
import { Text, Button } from 'react-native';
import Api from '../../Api';
import { useNavigation } from '@react-navigation/core';
import { UserContext } from '../../contexts/UserContext';
import { Container } from './styles';

export default () => {
    const { state: userContext } = useContext(UserContext);
    const user = userContext;
    const navigation = useNavigation();

    const handleLogoutClick = async () => {
        await Api.logout();

        navigation.reset({
            routes: [
                { name: 'SignIn' }
            ]
        });
    };

    return (
        <Container>
            <Text> Profile - ID { user.id }</Text>
            <Button title="Sair" onPress={handleLogoutClick} />
        </Container>
    )
}
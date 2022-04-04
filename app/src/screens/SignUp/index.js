import React, { useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../contexts/UserContext';
import { Container, InputArea, CustomButton, CustomButtonText, SignMessageButton, SignMessageButtonText, SignMessageButtonTextBold } from './styles';
import SignInput from '../../components/SignInput';
import BarberLogo from '../../assets/barber.svg' ;
import PersonIcon from '../../assets/person.svg';
import EmailIcon from '../../assets/email.svg';
import LockIcon from '../../assets/lock.svg';
import Api from '../../Api';

export default () => {
    const { dispatch: userDispatch } = useContext(UserContext);
    const navigation = useNavigation();

    const [ nameField, setNameField ] = useState('');
    const [ emailField, setEmailField ] = useState('');
    const [ passwordField, setPasswordField ] = useState('');

    const handleSignClick = async () => {
        if (nameField != '' && emailField != '' && passwordField != '') {
            try {
                let json = await Api.signUp(nameField, emailField, passwordField);

                if (json.token) {
                    await AsyncStorage.setItem('token', json.token);

                    userDispatch({
                        type: 'setAvatar',
                        payload: {
                            avatar: json.data.avatar
                        }
                    });

                    navigation.reset({
                        routes: [
                            { name: 'MainTab' }
                        ]
                    });
                } else {
                    alert("Erro : " + json.error);
                }
            } catch (error) {
                alert(error);
            }
        } else {
            alert('Preencha os campos!');
        }
    };

    const handleMessagemButtonClick = () => {
        navigation.reset({
            routes: [
                {name: 'SignIn'}
            ]
        });
    };

    return (
        <Container>
            <BarberLogo width="100%" height="160" />

            <InputArea>
            <SignInput
                    IconSvg={PersonIcon}
                    placeholder="Digite seu nome"
                    value={nameField}
                    onChangeText={text => setNameField(text)}
                />
                <SignInput
                    IconSvg={EmailIcon}
                    placeholder="Digite seu e-mail"
                    value={emailField}
                    onChangeText={text => setEmailField(text)}
                />
                <SignInput
                    IconSvg={LockIcon}
                    placeholder="Digite sua senha"
                    value={passwordField}
                    onChangeText={text => setPasswordField(text)}
                    password={true}
                />

                <CustomButton onPress={handleSignClick}>
                    <CustomButtonText> CADASTRAR </CustomButtonText>
                </CustomButton>
            </InputArea>

            <SignMessageButton onPress={handleMessagemButtonClick}>
                <SignMessageButtonText> Já possui uma conta? </SignMessageButtonText>
                <SignMessageButtonTextBold> Faça Login </SignMessageButtonTextBold>
            </SignMessageButton>
        </Container>
    );
};
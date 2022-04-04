import React, { useState, useEffect } from 'react';
import { Container, ListArea, Scroller, InputArea, HeaderArea, NameInput, InputIconArea, BackButton, LoadingIcon } from './styles';
import BarberItem from '../../components/BarberItem';
import SearchIcon from '../../assets/search.svg';
import BackIcon from '../../assets/back.svg';
import Api from '../../Api';
import { useNavigation } from '@react-navigation/native';

export default () => {
    const navigation = useNavigation();

    const[ list, setList ] = useState([]);
    const[ barberName, setBarberName ] = useState(null);
    const[ loading, setLoading ] = useState(false);

    const getBarbersByName = async () => {
        setLoading(true);
        setList([]);

        const res = await Api.getBarbersByName(barberName);

        if (!res.erro) {
            setList(res.data);
        } else {
            alert(res.erro);
        }

        setLoading(false);
    };

    const handleBarberNameSearch = () => {
        getBarbersByName();
    };

    const handleBackButton = () => {
        navigation.goBack();
    };

    useEffect(() => {
        getBarbersByName();
        setBarberName(null);
    }, []);

    return (
        <Container>
            <Scroller>
                <HeaderArea>
                    <BackButton onPress={handleBackButton}>
                        <BackIcon width="44" height="44" fill="#FFFFFF" />
                    </BackButton>
                    <InputArea>
                        <NameInput
                            placeholder="Digite o nome do barbeiro"
                            placeholderTextColor="#FFFFFF"
                            value={ barberName }
                            onChangeText={ text => setBarberName(text) }
                            onEndEditing={ handleBarberNameSearch }
                        />
                        <InputIconArea>
                            <SearchIcon width="26" height="26" fill="#FFFFFF" />
                        </InputIconArea>
                    </InputArea>
                </HeaderArea>

                { loading &&
                    <LoadingIcon size="large" color="#FFFFFF" /> 
                }

                <ListArea>
                    { list && list.map((item, key)=>(
                        <BarberItem key={ key } data={ item }/>
                    )) }
                </ListArea>
            </Scroller>
        </Container>
    )
}
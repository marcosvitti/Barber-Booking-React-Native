import React, { useState, useEffect } from 'react';
import { RefreshControl } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Api from '../../Api';
import {
    Container,
    Scroller,

    HeaderArea,
    BackButton,
    HeaderTittle,

    LoadingIcon,

    ListArea
} from './styles';
import BarberItem from '../../components/BarberItem';
import BackIcon from '../../assets/back.svg';

export default () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [ loading, setLoading ] = useState(false);
    const [ list, setList ] = useState([]);
    const [ refreshing, setRefreshing ] = useState(false);

    const getBarbers = async () => {
        setLoading(true);
        setList([]);

        let res = await Api.getFavBarbers();

        if (res.error == '') {
            setList(res.data);
        } else {
            alert("Erro" + res.error);
        }

        setLoading(false);
    };

    useEffect(() => {
        getBarbers();
    }, []);

    useEffect(() => {
        getBarbers();
    }, [isFocused]);

    const onRefresh = () => {
        setRefreshing(false);
        getBarbers();
    };

    const handleBackButton = () => {
        navigation.goBack();
    };

    return (
        <Container>
            <Scroller refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                <HeaderArea>
                    <BackButton onPress={handleBackButton}>
                        <BackIcon width="44" height="44" fill="#FFFFFF" />
                    </BackButton>
                    <HeaderTittle numberOfLines={1}> Favoritos </HeaderTittle>
                </HeaderArea>

                { loading && 
                    <LoadingIcon size="large" color="#FFFFFF" />
                }

                <ListArea>
                    {
                        list.map((item, key) => (
                            <BarberItem key={key} data={item} />
                        ))
                    }
                </ListArea>
            </Scroller>
        </Container>
    )
}
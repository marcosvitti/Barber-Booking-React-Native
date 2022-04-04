import React, { useState, useEffect, useContext } from 'react';
import { RefreshControl } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { UserContext } from '../../contexts/UserContext';
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
import BarberItem from '../../components/AppointmentItem';
import BackIcon from '../../assets/back.svg';

export default () => {
    const { state: userContext } = useContext(UserContext);
    const user = userContext;

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [ loading, setLoading ] = useState(false); 
    const [ refreshing, setRefreshing ] = useState(false);
    const [ list, setList ] = useState([]);

    const getAppointments = async () => {
        setLoading(true);
        setList([]);

        let res = await Api.getAppointments(user.id);

        if (res.error == '') {
            setList(res.data);
        } else {
            alert("Erro" + res.error);
        }

        setLoading(false);
    };

    useEffect(() => {
        getAppointments();
    }, []);

    useEffect(() => {
        //getAppointments();
    }, [isFocused]);

    const onRefresh = () => {
        setRefreshing(false);
        getAppointments();
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
                    <HeaderTittle numberOfLines={1}>Agendamentos</HeaderTittle>
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
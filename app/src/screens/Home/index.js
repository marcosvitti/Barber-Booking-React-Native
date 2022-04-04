import React, { useState, useEffect } from 'react';
import { RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Api from '../../Api';
import {
    Container,
    Scroller,

    HeaderArea, 
    HeaderTittle,
    SearchButton,

    LocationArea,
    LocationInput,
    LocationFinder,

    LoadingIcon,

    ListArea
} from './styles';
import BarberItem from '../../components/BarberItem';
import SearchIcon from '../../assets/search.svg';
import MyLocationIcon from '../../assets/my_location.svg';

export default () => {
    const navigation = useNavigation();

    const [ locationText, setLocationText ] = useState('');
    const [ coords, setCoords ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ list, setList ] = useState([]);
    const [ refreshing, setRefreshing ] = useState(false);

    const handleLocationFinder = async () => {
        setCoords(null);

        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status == 'granted') {
            setLoading(true);
            setLocationText('');
            setList([]);

            let location = Location.watchPositionAsync(
                {
                    enableHighAccuracy: true,
                    distanceInterval: 1,
                    timeInterval: 1000
                },
                location => {
                    setCoords(location.coords);
                    console.log(location.coords);
                }
            );
            getBarbers();
        }
    };

    const getBarbers = async () => {
        setLoading(true);
        setList([]);

        let lat = null;
        let lng = null;

        if (coords) {
            lat = coords.latitude;
            lng = coords.longitude;
        }

        let res = await Api.getBarbers(lat, lng, locationText);

        if (res.error == '') {
            if (res.loc) {
                setLocationText(res.loc);
            }

            setList(res.data);
        } else {
            alert("Erro" + res.error);
        }

        setLoading(false);
    };

    useEffect(() => {
        getBarbers();
    }, []);

    const onRefresh = () => {
        setRefreshing(false);
        getBarbers();
    };

    const handleLocationSearch = () => {
        setCoords({});
        getBarbers();
    };

    return (
        <Container>
            <Scroller refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                <HeaderArea>
                    <HeaderTittle numberOfLines={2}> Encontre o seu barbeiro favorito </HeaderTittle>
                    <SearchButton onPress={ () => { navigation.navigate('Search') } } >
                        <SearchIcon width="26" height="26" fill="#FFFFFF" />
                    </SearchButton>
                </HeaderArea>

                <LocationArea>
                    <LocationInput
                        placeholder="Onde você está ?"
                        placeholderTextColor="#FFFFFF"
                        value={ locationText }
                        onChangeText={ text => setLocationText(text) }
                        onEndEditing={ handleLocationSearch }
                    />
                    <LocationFinder onPress={ handleLocationFinder }>
                        <MyLocationIcon width="24" height="24" fill="#FFFFFF" />
                    </LocationFinder>
                </LocationArea>

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
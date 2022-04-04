import React, { useState, useEffect } from 'react';
import { 
    Container,
    Scroller,
    SwipeDot,
    SwipeDotActive,
    SwipeItem,
    SwipeImage,
    FakeSwiper,
    PageBody,
    UserInfoArea,
    ServiceArea,
    ServicesTitle,
    ServiceItem,
    ServiceInfo,
    ServiceName,
    ServicePrice,
    ServiceChooseButton,
    ServiceChooseButtonText,
    TestimonialArea,
    TestimonialItem,
    TestimonialInfo,
    TestimonialName,
    TestimonialBody,
    UserAvatar,
    UserInfo,
    UserInfoName,
    UserFavButton,
    BackButton,
    LoadingIcon,
} from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import Api from '../../Api';
import Swiper from 'react-native-swiper';
import Stars from '../../components/Stars';
import BarberModal from '../../components/BarberModal';
import FavoriteIcon from '../../assets/favorite.svg';
import FavoriteFullIcon from '../../assets/favorite_full.svg';
import BackIcon from '../../assets/back.svg';
import NavPrevIcon from '../../assets/nav_prev.svg';
import NavNextIcon from '../../assets/nav_next.svg';

export default () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [ userInfo, setuserInfo ] = useState({
        id: route.params.id,
        avatar: route.params.avatar,
        name: route.params.name,
        stars: route.params.stars,
    });

    const [ loading, setLoading ] = useState(false);
    const [ favorited, setFavorited ] = useState(false);
    const [ selectedService, setSelectedService ] = useState(null);
    const [ showModal, setShowModal ] = useState(false);

    useEffect(() => {
        let getBarberInfo = async () => {
            setLoading(true);
            let json = await Api.getBarber(userInfo.id);

            if (json.error == '') {
                setuserInfo(json.data);
                setFavorited(json.data.favorited);
            } else {
                alert('Erro: ' + json.error);
            }

            setLoading(false);
        }

        getBarberInfo();
    }, []);

    const handleBackButton = () => {
        navigation.goBack();
    };

    const handleFavClick = () => {
        setFavorited(!favorited);
        Api.setFavorite(userInfo.id, !favorited);
    };

    const handleServiceChoose = (key) => {
        setSelectedService(key);
        setShowModal(true);
    };

    return (
        <Container>
            <Scroller>
                { userInfo.photos && userInfo.photos.length > 0 ?
                    <Swiper
                        style={ { height: 240 } }
                        dot={ <SwipeDot /> }
                        activeDot={ <SwipeDotActive /> }
                        paginationStyle={
                            { top: 15, right: 15, bottom: null, left: null }
                        }
                        autoplay={ true }
                    >
                        { userInfo.photos.map((item, key) => (
                            <SwipeItem key={key} >
                                <SwipeImage source={ { uri: item.url } } resizeMode="cover" />
                            </SwipeItem>
                        )) }
                    </Swiper>
                    :
                    <FakeSwiper>
                        { loading &&
                            <LoadingIcon size="large" color="#FFFFFF" />
                        }
                    </FakeSwiper>
                }
                <PageBody>
                    <UserInfoArea>
                        <UserAvatar source={ { uri: userInfo.avatar } } />
                        <UserInfo>
                            <UserInfoName>{ userInfo.name }</UserInfoName>
                            <Stars stars={ userInfo.stars } showNumber={ true }/>
                        </UserInfo>
                        <UserFavButton onPress={ handleFavClick }>
                            { favorited ?
                                <FavoriteFullIcon width="24" height="24" fill="#FF0000" />
                                :
                                <FavoriteIcon width="24" height="24" fill="#FF0000" />
                            }
                        </UserFavButton>
                    </UserInfoArea>

                    { loading &&
                        <LoadingIcon size="large" color="#4EADBE" />
                    }

                    { userInfo.services &&
                        <ServiceArea>
                            <ServicesTitle>Lista de serviços</ServicesTitle>

                            { userInfo.services && userInfo.services.length <= 0 &&
                                <ServiceItem key={ 1 }>
                                    <ServiceInfo>
                                        <ServiceName>{ 'Nenhum serviço disponível no momento' }</ServiceName>
                                    </ServiceInfo>
                                </ServiceItem>
                            }

                            { userInfo.services.map((item, key) => (
                                <ServiceItem key={ key }>
                                    <ServiceInfo>
                                        <ServiceName>{ item.name }</ServiceName>
                                        <ServicePrice>R$ { item.price.toFixed(2) }</ServicePrice>
                                    </ServiceInfo>
                                    <ServiceChooseButton onPress={ () => handleServiceChoose(item.id) }>
                                        <ServiceChooseButtonText>Agendar</ServiceChooseButtonText>
                                    </ServiceChooseButton>
                                </ServiceItem>
                            )) }
                        </ServiceArea>
                    }

                    { userInfo.testimonials && userInfo.testimonials.length <= 0 &&
                        <TestimonialArea>
                            <TestimonialItem key={ 1 }>
                                <TestimonialInfo>
                                    <TestimonialName>{ '' }</TestimonialName>
                                    <Stars stars={ 0 } showNumber={ false } />
                                </TestimonialInfo>
                                <TestimonialBody>{ 'Nenhuma avaliação para esse barbeiro!' }</TestimonialBody>
                            </TestimonialItem>
                        </TestimonialArea>
                    }

                    { userInfo.testimonials && userInfo.testimonials.length > 0 &&
                        <TestimonialArea>
                            <Swiper
                                style={ { height: 110 } }
                                showsPagination={ false }
                                showsButtons={ true }
                                prevButton={ <NavPrevIcon width="35" height="35" fill="#000000" /> }
                                nextButton={ <NavNextIcon width="35" height="35" fill="#000000" /> }
                            >
                                { userInfo.testimonials.map((item, key) => (
                                    <TestimonialItem key={ key }>
                                        <TestimonialInfo>
                                            <TestimonialName>{ item.name }</TestimonialName>
                                            <Stars stars={ item.rate } showNumber={ false } />
                                        </TestimonialInfo>
                                        <TestimonialBody>{ item.body }</TestimonialBody>
                                    </TestimonialItem>
                                ))
                                }
                            </Swiper>
                        </TestimonialArea>
                    }
                </PageBody>
            </Scroller>
            <BackButton onPress={handleBackButton}>
                <BackIcon width="44" height="44" fill="#FFFFFF" />
            </BackButton>

            <BarberModal
                show={ showModal }
                setShow={ setShowModal }
                barber={ userInfo }
                service={ selectedService }
            />
        </Container>
    )
}
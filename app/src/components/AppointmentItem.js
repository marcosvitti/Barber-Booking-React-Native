import React from 'react';
import styled from 'styled-components/native';

const Area = styled.TouchableOpacity`
    background-color: #FFFFFF;
    margin-bottom: 20px;
    border-radius: 20px;
    padding: 15px;
`;

const BarberArea = styled.View`
    margin-left: 10px;
    flex: 1;
    flex-direction: row;
    align-items: center;
`;

const AvatarBarber = styled.Image`
    width: 66px;
    height: 66px;
    border-radius: 18px;
    margin-right: 10px;
`;

const BarberName = styled.Text`
    font-size: 17px;
    font-weight: bold;
    margin-left: 10px;
`;

const AppointmentArea = styled.View`
    margin-left: 10px;
`;

const ServiceArea = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;
    margin-bottom: 8px;
`;

const ServiceName = styled.Text`
    font-size: 16px;
    font-weight: bold;
`;

const ServicePrice = styled.Text`
    font-size: 16px;
    font-weight: bold;
`;

const AppointmentInfo = styled.View`
    flex-direction: row;
    justify-content: space-between;
`;

const AppointmentBagde = styled.View`
    padding: 10px;
    background-color: #63C2D1;
    border-radius: 10px;
`;

const AppointmentDate = styled.Text`
    font-size: 14px;
    font-weight: bold;
    color: #FFFFFF;
`;

const AppointmentHour = styled.Text`
    font-size: 14px;
    font-weight: bold;
    color: #FFFFFF;
`;
export default ({data}) => {
    return (
        <Area activeOpacity={ !data.appointment.expired ? 0.8 : 0.5 } style={ {opacity: !data.appointment.expired ? 1 : 0.5} }>
            <BarberArea>
                <AvatarBarber source={ {uri: data.barber.avatar} } />
                <BarberName>{ data.barber.name }</BarberName>
            </BarberArea>
            <AppointmentArea>
                <ServiceArea>
                    <ServiceName>{ data.service.description }</ServiceName>
                    <ServicePrice>{ data.service.price }</ServicePrice>
                </ServiceArea>
                <AppointmentInfo>
                    <AppointmentBagde>
                        <AppointmentDate>{ data.appointment.time.date }</AppointmentDate>
                    </AppointmentBagde>
                    <AppointmentBagde>
                        <AppointmentHour>{ data.appointment.time.hour }</AppointmentHour>
                    </AppointmentBagde>
                </AppointmentInfo>
            </AppointmentArea>
        </Area>
    );
}
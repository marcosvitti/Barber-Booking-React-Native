import React from 'react';
import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
    flex: 1;
    background-color: #63C2D1;
`;
export const Scroller = styled.ScrollView`
    flex: 1;
    padding: 20px;
`;

export const HeaderArea = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;
export const BackButton = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    margin-top: 30px;
`;
export const HeaderTittle = styled.Text`
    width: 250px;
    font-size: 24px;
    font-weight: bold;
    color: #FFFFFF;
    margin-top: 30px;
`;

export const LoadingIcon = styled.ActivityIndicator`
    margin-top: 50px;
`;

export const ListArea = styled.View`
    margin-top: 30px;
    margin-bottom: 30px;
`;
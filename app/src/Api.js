import AsyncStorage from "@react-native-async-storage/async-storage";

//const BASE_API = 'https://api.b7web.com.br/devbarber/api';
const BASE_API = 'http://192.168.15.7:81';

export default {
    checkToken: async (token) => {
        const req = await fetch(`${BASE_API}/auth/refresh`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({token})
        });

        const json = await req.json();

        return json;
    },
    signIn: async (email, password) => {
        const req = await fetch(`${BASE_API}/auth/login`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        });

        const json = await req.json();

        return json;
    },
    signUp: async (name, email, password) => {
        const req = await fetch(`${BASE_API}/user`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, email, password})
        });

        const json = await req.json();

        return json;
    },
    logout: async () => {
        const token = await AsyncStorage.getItem('token');

        const req = await fetch(`${BASE_API}/auth/logout`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({token})
        });

        const json = await req.json();

        return json;
    },
    getBarbers: async (lat=null, lgn=null, address=null) => {
        const token = await AsyncStorage.getItem('token');

        const req = await fetch(`${BASE_API}/barbers?token=${token}&lat=${lat}&lng=${lgn}&address=${address}`);

        const json = await req.json();

        return json;
    },
    getFavBarbers: async () => {
        const token = await AsyncStorage.getItem('token');

        const req = await fetch(`${BASE_API}/user/favorites?token=${token}`);

        const json = await req.json();

        return json;
    },
    getBarbersByName: async (name=null) => {
        const token = await AsyncStorage.getItem('token');

        const req = await fetch(`${BASE_API}/barbers?token=${token}&name=${name}`);

        const json = await req.json();

        return json;
    },
    getBarber: async (id) => {
        const token = await AsyncStorage.getItem('token');

        const req = await fetch(`${BASE_API}/barber/${id}?token=${token}`);

        const json = await req.json();

        return json;
    },
    setFavorite: async (barberId, favorited) => {
        const token = await AsyncStorage.getItem('token');
        const endpoint = favorited ? 'add' : 'del';

        const req = await fetch(`${BASE_API}/user/${endpoint}/favorite`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({token: token, barber: barberId})
        });

        const json = await req.json();

        return json;
    },
    setAppointment: async (userId, service, selectedYear, selectedMonth, selectedDay, selectedHour) => {
        const token = await AsyncStorage.getItem('token');

        const req = await fetch(`${BASE_API}/appointments`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token, 
                user: userId, 
                barber_service: service, 
                date: `${selectedYear}-${selectedMonth < 10 ? '0'+selectedMonth : selectedMonth}-${selectedDay < 10 ? '0'+selectedDay : selectedDay}`, 
                hour: selectedHour
            })
        });

        const json = await req.json();

        return json;
    },
    getAppointments:  async (userId) => {
        const token = await AsyncStorage.getItem('token');

        const req = await fetch(`${BASE_API}/appointments/${userId}?token=${token}`);

        const json = await req.json();

        return json;
    },
};
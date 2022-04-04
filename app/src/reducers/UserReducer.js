export const initialState = {
    id: null,
    avatar: '',
    favoritos: [],
    appointments: []
};

export const UserReducer = (state, action) => {
    switch(action.type) {
        case 'setId':
            return { ...state, id: action.payload.id };
        break;

        case 'setAvatar':
            return { ...state, avatar: action.payload.avatar };
        break;

        default:
            return state;
    }
};
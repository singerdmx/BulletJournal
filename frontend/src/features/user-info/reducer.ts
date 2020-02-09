import { createSlice, PayloadAction } from 'redux-starter-kit';

export type UserInFoWithAvatar = {
    username: string;
    avatar: string;
}

export type ApiErrorAction = {
    error: string;
};

export type UpdateUserInfo = {

}


let initialState = {  
    username: '',
    avatar: ''
};


const slice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        UserDataReceived: (state, action: PayloadAction<UserInFoWithAvatar>) => {
            const { username, avatar } = action.payload;
            state.username = username;
            state.avatar = avatar;
        },
        userApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
        UserInfoUpdate: (state, action: PayloadAction<UpdateUserInfo>)=>state
    },
});

export const updateUserInfo = () => actions.UserInfoUpdate({})

export const reducer = slice.reducer;
export const actions = slice.actions;
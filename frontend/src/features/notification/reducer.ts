import {createSlice, PayloadAction } from 'redux-starter-kit';

export type NoticeApiErrorAction = {
    error: string;
};

export type UpdateNotifications = {

}

export interface Originator{
    id: number,
    name: string,
    thumbnail: string,
    avatar: string
};

export interface Notification {
    id: number,
    title: string,
    content: string,
    timestamp: number,
    originator: Originator,
    actions: Array<string>,
    type: string,
};

export type NotificationsAction = {
    notifications: Array<Notification>
}

let initialState = {
    notifications: [] as Array<Notification>
}

const slice = createSlice({
    name: 'notice',
    initialState,
    reducers: {
        notificationsReceived: ( state, action: PayloadAction<NotificationsAction> ) => {
            const { notifications } = action.payload;
            state.notifications = notifications
        },
        noticeApiErrorReceived: ( state, action: PayloadAction<NoticeApiErrorAction> ) => state,
        notificationsUpdate: (state, action: PayloadAction<UpdateNotifications> ) => state
    }
});

export const updateNotifications = () => actions.notificationsUpdate({})

export const reducer = slice.reducer;
export const actions = slice.actions;


import {createSlice, PayloadAction} from 'redux-starter-kit';

export type ApiErrorAction = {
    error: string;
};

export type UpdateNotifications = Notification[];

export type Originator = {
    id: number;
    name: string;
    thumbnail: string;
    avatar: string;
};

export type Notification = {
    id: number;
    title: string;
    content: string;
    timestamp: number;
    originator: Originator;
    actions: string[];
    type: string;
};

export type NotificationsAction = {
    notifications: Notification[]
}

const slice = createSlice({
    name: "notifications",
    initialState: [],
    reducers: {
        notificationsReceived: (
            state: Notification[],
            action: PayloadAction<NotificationsAction>
        ) => {
            const {notifications} = action.payload;
            state = notifications;
        },
        notificationApiErrorReceived: (
            state,
            action: PayloadAction<ApiErrorAction>
        ) => state,
        notificationsUpdate: (state, action: PayloadAction<UpdateNotifications>) => state
    }
});

export const updateNotifications = () => actions.notificationsUpdate([]);

export const reducer = slice.reducer;
export const actions = slice.actions;


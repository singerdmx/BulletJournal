import {createSlice, PayloadAction} from 'redux-starter-kit';
import {UserPointActivity} from "../../pages/points/interface";
import {SubscribedCategory} from "./interface";
import {SampleTask} from "../templates/interface";

export type MyselfWithAvatar = {
    username?: string;
    avatar?: string;
    timezone?: string;
    before?: number;
    currency?: string;
    theme?: string;
    points?: number;
    firstTime?: boolean;
    sendUserInvitation?: boolean;
};

export type MyselfApiErrorAction = {
    error: string;
};

export type ReloadAction = {
    reload: boolean;
};

export type UpdateMyself = {};

export type ThemeUpdate = {};

export type UpdateExpandedMyself = {
    updateSettings: boolean;
};

export type ExpandedMyselfLoading = {
    loading: boolean;
};

export type PatchMyself = {
    timezone?: string;
    before?: number;
    currency?: string;
    theme?: string;
};

export type ClearMyself = {};

export type FetchUserPointActivities = {};

export type GetSubscribedCategories = {};

export type UnsubscribedCategory = {
    categoryId: number;
    selectionId: number;
};

export type UpdateCategorySubscription = {
    categoryId: number;
    selectionId: number;
    projectId: number;
};

export type MySampleTasksAction = {};

export type SampleTasksAction = {
    sampleTasks: SampleTask[];
};

export type DeleteSampleTaskAction = {
    id: number;
}

export type DeleteSampleTasksAction = {
    sampleTasks: number[];
    projectId: number;
    assignees: string[];
    reminderBefore: number;
    labels: number[];
    startDate?: string;
    timezone?: string;
};

export type DeletingSampleTasksAction = {
    deleting: boolean;
}

export type UserPointActivities = {
    userPointActivities: UserPointActivity[];
};

export type SubscribedCategories = {
    subscribedCategories: SubscribedCategory[];
};

let initialState = {
    username: '',
    avatar: '',
    timezone: '',
    before: 0,
    currency: '',
    theme: 'LIGHT',
    loading: false,
    points: 0,
    firstTime: false,
    reload: false,
    sendUserInvitation: false,
    userPointActivities: [] as Array<UserPointActivity>,
    subscribedCategories: [] as SubscribedCategory[],
    sampleTasks: [] as SampleTask[],
    removingSampleTasks: false,
};

const slice = createSlice({
    name: 'myself',
    initialState,
    reducers: {
        myselfDataReceived: (state, action: PayloadAction<MyselfWithAvatar>) => {
            const {
                username,
                avatar,
                timezone,
                before,
                currency,
                theme,
                points,
                firstTime,
                sendUserInvitation
            } = action.payload;
            if (username && username.length > 0) state.username = username;
            if (avatar && avatar.length > 0) state.avatar = avatar;
            if (timezone && timezone.length > 0) state.timezone = timezone;
            if (before || before === 0) state.before = before!;
            if (currency && currency.length > 0) state.currency = currency;
            if (theme) state.theme = theme;
            if (points) state.points = points;
            if (firstTime) state.firstTime = firstTime;
            if (sendUserInvitation !== undefined) state.sendUserInvitation = sendUserInvitation;
        },
        reloadReceived: (state, action: PayloadAction<ReloadAction>) => {
            const {reload} = action.payload;
            state.reload = reload;
        },
        myselfApiErrorReceived: (
            state,
            action: PayloadAction<MyselfApiErrorAction>
        ) => state,
        themeUpdate: (state, action: PayloadAction<ThemeUpdate>) => state,
        myselfUpdate: (state, action: PayloadAction<UpdateMyself>) => state,
        patchMyself: (state, action: PayloadAction<PatchMyself>) => state,
        clearMyself: (state, action: PayloadAction<ClearMyself>) => state,
        getUserPointActivities: (state, action: PayloadAction<FetchUserPointActivities>) => state,
        expandedMyselfLoading: (
            state,
            action: PayloadAction<ExpandedMyselfLoading>
        ) => {
            const {loading} = action.payload;
            state.loading = loading;
        },
        expandedMyselfUpdate: (
            state,
            action: PayloadAction<UpdateExpandedMyself>
        ) => state,
        userPointActivitiesReceived: (
            state,
            action: PayloadAction<UserPointActivities>
        ) => {
            const {userPointActivities} = action.payload;
            state.userPointActivities = userPointActivities;
        },
        subscribedCategoriesReceived: (state, action: PayloadAction<SubscribedCategories>) => {
            const {subscribedCategories} = action.payload;
            state.subscribedCategories = subscribedCategories;
        },
        getSubscribedCategories: (state, action: PayloadAction<GetSubscribedCategories>) => state,
        unsubscribedCategory: (state, action: PayloadAction<UnsubscribedCategory>) => state,
        updateCategorySubscription: (state, action: PayloadAction<UpdateCategorySubscription>) => state,
        getMySampleTasks: (state, action: PayloadAction<MySampleTasksAction>) => state,
        sampleTasksReceived: (
            state,
            action: PayloadAction<SampleTasksAction>
        ) => {
            const {sampleTasks} = action.payload;
            state.sampleTasks = sampleTasks;
        },
        deleteMySampleTask: (state, action: PayloadAction<DeleteSampleTaskAction>) => state,
        deleteMySampleTasks: (state, action: PayloadAction<DeleteSampleTasksAction>) => state,
        removingSampleTasksReceived: (state, action: PayloadAction<DeletingSampleTasksAction>) => {
            const {deleting} = action.payload;
            state.removingSampleTasks = deleting;
        }
    },
});

export const reducer = slice.reducer;
export const actions = slice.actions;

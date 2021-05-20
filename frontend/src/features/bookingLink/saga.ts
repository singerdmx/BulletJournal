import {all, call, put, takeLatest} from "redux-saga/effects";
import {actions as bookingLinksActions, AddBookingLink} from "./reducer";
import {PayloadAction} from "redux-starter-kit";
import {message} from "antd";
import {reloadReceived} from "../myself/actions";
import {createBookingLink} from "../../apis/bookinglinkApis";

function* addBookingLink(action: PayloadAction<AddBookingLink>) {
    try {
        const {
            bufferInMin,
            endDate,
            expireOnBooking,
            includeTaskWithoutDuration,
            projectId,
            recurrences,
            slotSpan,
            startDate,
            timezone
        } = action.payload;

        const data = yield call(
            createBookingLink,
            bufferInMin,
            endDate,
            expireOnBooking,
            includeTaskWithoutDuration,
            projectId,
            recurrences,
            slotSpan,
            startDate,
            timezone
        );
        yield put(bookingLinksActions.linkReceived({link: data}));
        yield call(
            message.success,
            `Booking link is created`
        );
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield call(message.error, `Create booking link fail: ${error}`);
        }
    }
}

export default function* groupSagas() {
    yield all([
        yield takeLatest(bookingLinksActions.AddBookingLink.type, addBookingLink),
    ]);
}
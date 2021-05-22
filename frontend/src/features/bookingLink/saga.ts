import {all, call, put, takeLatest} from "redux-saga/effects";
import {actions as bookingLinksActions, AddBookingLink, PatchBookingLink} from "./reducer";
import {PayloadAction} from "redux-starter-kit";
import {message} from "antd";
import {reloadReceived} from "../myself/actions";
import {createBookingLink, updateBookingLink} from "../../apis/bookinglinkApis";
import {BookingLink} from "./interface";

function* addBookingLink(action: PayloadAction<AddBookingLink>) {
    try {
        const {
            afterEventBuffer,
            beforeEventBuffer,
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
            afterEventBuffer,
            beforeEventBuffer,
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
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield call(message.error, `Create booking link fail: ${error}`);
        }
    }
}

function* patchBookingLink(action: PayloadAction<PatchBookingLink>) {
    try {
        const {
            bookingLinkId,
            timezone,
            afterEventBuffer,
            beforeEventBuffer,
            endDate,
            expireOnBooking,
            includeTaskWithoutDuration,
            location,
            projectId,
            startDate,
        } = action.payload

        const data: BookingLink = yield call(
            updateBookingLink,
            bookingLinkId,
            timezone,
            afterEventBuffer,
            beforeEventBuffer,
            endDate,
            expireOnBooking,
            includeTaskWithoutDuration,
            location,
            projectId,
            startDate,
        );
        yield put(bookingLinksActions.linkReceived({link: data}));
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield call(message.error, `Update booking link fail: ${error}`);
        }
    }
}

export default function* groupSagas() {
    yield all([
        yield takeLatest(bookingLinksActions.AddBookingLink.type, addBookingLink),
        yield takeLatest(bookingLinksActions.PatchBookingLink.type, patchBookingLink),
    ]);
}
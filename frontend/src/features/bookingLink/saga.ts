import { linkReceived } from './actions';
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import {
    actions as bookingLinksActions,
    AddBookingLink,
    BookMeUsernameAction,
    FetchBookMeUsername,
    PatchBookingLink,
    FetchBookingLinks,
    UpdateBookingLinkRecurrences,
    FetchBookingLink,
    UpdateBookingLinkSlot,
    CreateBooking,
    FetchBooking,
    CancelBooking,
    DeleteBookingAction,
    CloneBookingAction,
} from "./reducer";
import { PayloadAction } from "redux-starter-kit";
import { message } from "antd";
import { reloadReceived } from "../myself/actions";
import {
    createBookingLink,
    getBookMeUsername,
    updateBookingLink,
    updateBookMeUsername,
    getBookingLinks,
    updateBookingLinkRecurrences,
    updateBookingLinkSlot,
    getBookingLink, book, getBooking, cancelBooking, deleteBooking,
    cloneBooking,
} from "../../apis/bookinglinkApis";
import { Booking, BookingLink } from "./interface";
import { IState } from "../../store";

function* fetchBookMeUsername(action: PayloadAction<FetchBookMeUsername>) {
    try {
        const data = yield call(getBookMeUsername);
        const name: string = yield data.text();
        yield put(bookingLinksActions.bookMeUsernameReceived({ name: name }));
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield call(message.error, `fetchBookMeUsername fail: ${error}`);
        }
    }
}

function* putBookMeUsername(action: PayloadAction<BookMeUsernameAction>) {
    try {
        const { name } = action.payload;
        yield call(updateBookMeUsername, name);
        yield put(bookingLinksActions.bookMeUsernameReceived({ name: name }));
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield call(message.error, `putBookMeUsername fail: ${error}`);
        }
    }
}

function* fetchBookingLink(action: PayloadAction<FetchBookingLink>) {
    try {
        const { bookingLinkId, timezone } = action.payload;
        const link: BookingLink = yield call(getBookingLink, bookingLinkId, timezone);
        yield put(bookingLinksActions.linkReceived({ link: link }));
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield call(message.error, `fetchBookingLink fail: ${error}`);
        }
    }
}

function* fetchBookingLinks(action: PayloadAction<FetchBookingLinks>) {
    try {
        const links: BookingLink[] = yield call(getBookingLinks);
        yield put(bookingLinksActions.bookingLinksReceived({ links: links }));
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield call(message.error, `fetchBookingLinks fail: ${error}`);
        }
    }
}

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
            timezone,
            onSuccess
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
        yield put(bookingLinksActions.linkReceived({ link: data }));
        onSuccess();
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
            note
        } = action.payload

        const state: IState = yield select();
        const link: BookingLink = { ...state.bookingReducer.link! };
        link.timezone = timezone;
        if (afterEventBuffer) {
            link.afterEventBuffer = afterEventBuffer;
        }
        if (beforeEventBuffer) {
            link.beforeEventBuffer = beforeEventBuffer;
        }
        if (endDate) {
            link.endDate = endDate;
        }
        if (startDate) {
            link.startDate = startDate;
        }
        if (expireOnBooking) {
            link.expireOnBooking = expireOnBooking;
        }
        if (includeTaskWithoutDuration) {
            link.includeTaskWithoutDuration = includeTaskWithoutDuration;
        }
        if (location) {
            link.location = location;
        }
        if (note) {
            link.note = note;
        }
        if (projectId) {
            // skip project for now
        }
        yield put(bookingLinksActions.linkReceived({ link: link }));
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
            note
        );
        yield put(bookingLinksActions.linkReceived({ link: data }));
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield call(message.error, `Update booking link fail: ${error}`);
        }
    }
}

function* changeBookingLinkRecurrences(action: PayloadAction<UpdateBookingLinkRecurrences>) {
    try {
        const {
            bookingLinkId,
            recurrences,
            timezone
        } = action.payload;

        const data: BookingLink = yield call(
            updateBookingLinkRecurrences,
            bookingLinkId,
            recurrences,
            timezone
        );
        yield put(bookingLinksActions.linkReceived({ link: data }));
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield call(message.error, `changeBookingLinkRecurrences fail: ${error}`);
        }
    }
}

function* changeBookingLinkSlot(action: PayloadAction<UpdateBookingLinkSlot>) {
    try {
        const {
            bookingLinkId,
            slot,
            timezone
        } = action.payload;

        const data: BookingLink = yield call(
            updateBookingLinkSlot,
            bookingLinkId,
            slot,
            timezone
        );
        yield put(bookingLinksActions.linkReceived({ link: data }));
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield call(message.error, `changeBookingLinkSlot fail: ${error}`);
        }
    }
}

function* createBooking(action: PayloadAction<CreateBooking>) {
    try {
        const {
            bookingLinkId,
            invitees,
            slotIndex,
            slotDate,
            location,
            note,
            requesterTimezone,
            displayDate,
            startTime,
            endTime,
            onSuccess
        } = action.payload;

        const data: Booking = yield call(
            book,
            bookingLinkId,
            invitees,
            slotIndex,
            slotDate,
            location,
            note,
            requesterTimezone,
            displayDate,
            startTime,
            endTime
        );
        onSuccess(data.id);
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield call(message.error, `createBooking fail: ${error}`);
        }
    }
}

function* fetchBooking(action: PayloadAction<FetchBooking>) {
    try {
        const { bookingId } = action.payload;
        const booking: Booking = yield call(getBooking, bookingId);
        yield put(bookingLinksActions.bookingReceived({ booking: booking }));
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield put(bookingLinksActions.bookingReceived({ booking: undefined }));
        }
    }
}

function* cancelCurrentBooking(action: PayloadAction<CancelBooking>) {
    try {
        const { bookingId, name, onSuccess } = action.payload;
        yield call(cancelBooking, bookingId, name);
        onSuccess();
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield call(message.error, `cancelCurrentBooking fail: ${error}`);
        }
    }
}

function* removeBookingLink(action: PayloadAction<DeleteBookingAction>) {
    try {
        const { bookingLinkId } = action.payload;
        const links = yield call(deleteBooking, bookingLinkId);
        yield put(bookingLinksActions.bookingLinksReceived({ links: links }));
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield call(message.error, `removeBookingLink fail: ${error}`);
        }
    }
}

function* cloneBookingLink(action: PayloadAction<CloneBookingAction>) {
    try {
        const { bookingLinkId, slotSpan } = action.payload;
        const links = yield call(cloneBooking, bookingLinkId, slotSpan);
        yield put(bookingLinksActions.bookingLinksReceived({ links: links }));
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield call(message.error, `cloneBookingLink fail: ${error}`);
        }
    }
}

export default function* groupSagas() {
    yield all([
        yield takeLatest(bookingLinksActions.AddBookingLink.type, addBookingLink),
        yield takeLatest(bookingLinksActions.PatchBookingLink.type, patchBookingLink),
        yield takeLatest(bookingLinksActions.GetBookMeUsername.type, fetchBookMeUsername),
        yield takeLatest(bookingLinksActions.UpdateBookMeUsername.type, putBookMeUsername),
        yield takeLatest(bookingLinksActions.GetBookingLinks.type, fetchBookingLinks),
        yield takeLatest(bookingLinksActions.UpdateBookingLinkRecurrences.type, changeBookingLinkRecurrences),
        yield takeLatest(bookingLinksActions.GetBookingLink.type, fetchBookingLink),
        yield takeLatest(bookingLinksActions.UpdateBookingLinkSlot.type, changeBookingLinkSlot),
        yield takeLatest(bookingLinksActions.CreateBooking.type, createBooking),
        yield takeLatest(bookingLinksActions.GetBooking.type, fetchBooking),
        yield takeLatest(bookingLinksActions.CancelBooking.type, cancelCurrentBooking),
        yield takeLatest(bookingLinksActions.deleteBooking.type, removeBookingLink),
        yield takeLatest(bookingLinksActions.cloneBooking.type, cloneBookingLink),
    ]);
}
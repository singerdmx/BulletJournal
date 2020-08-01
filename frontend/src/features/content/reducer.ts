import {createSlice, PayloadAction} from 'redux-starter-kit';
import {Content} from "../myBuJo/interface";

export type ContentAction = {
  content: Content | undefined;
};

export type DisplayMoreAction = {
  displayMore: boolean;
};

export type DisplayRevisionAction = {
  displayRevision: boolean;
};

let initialState = {
  content: undefined as Content | undefined,
  displayMore: false,
  displayRevision: false,
};

const slice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    updateContent: (state, action: PayloadAction<ContentAction>) => {
      const {content} = action.payload;
      state.content = content;
    },
    setDisplayMore: (state, action: PayloadAction<DisplayMoreAction>) => {
      const {displayMore} = action.payload;
      state.displayMore = displayMore;
    },
    setDisplayRevision: (state, action: PayloadAction<DisplayRevisionAction>) => {
      const {displayRevision} = action.payload;
      state.displayRevision = displayRevision;
    },
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;

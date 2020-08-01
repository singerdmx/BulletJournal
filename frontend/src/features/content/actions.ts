import {actions} from './reducer';
import {Content} from "../myBuJo/interface";

export const updateTargetContent = (content: Content | undefined) => actions.updateContent({content: content});
export const setDisplayMore = (displayMore: boolean) => actions.setDisplayMore({displayMore: displayMore});
export const setDisplayRevision = (displayRevision: boolean) => actions.setDisplayRevision({displayRevision: displayRevision});
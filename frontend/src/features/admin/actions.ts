import { actions } from './reducer';
import { Role } from './interface';

export const setRole = (username: string, role: Role) =>
  actions.setRole({ username: username, role: role });

export const changePoints = (username: string, points: number, description: string) =>
  actions.changePoints({ username: username, points: points, description: description });

export const setPoints = (username: string, points: number) =>
  actions.setPoints({ username: username, points: points });

export const userInfoPointsReceived = (points: number) =>
  actions.userInfoPointsReceived({ points: points });

export const getUsersByRole = (role: Role) =>
  actions.getUsersByRole({ role: role });

export const getLockedUsersAndIPs = () => actions.getLockedUsersAndIPs({});

export const unlockUserandIP = (name: string, ip: string) =>
  actions.unlockUserandIP({ name: name, ip: ip });

export const lockUserandIP = (name: string, ip: string, reason: string) =>
  actions.lockUserandIP({ name: name, ip: ip, reason: reason });

export const getUserInfo = (username: string) =>
  actions.getUserInfo({ username: username });

export const getCategorySteps = (categoryId: number) => actions.getCategorySteps({categoryId: categoryId});

export const approveSampleTask = (sampleTaskId: number, choiceId: number, selections: number[]) =>
    actions.approveSampleTask({sampleTaskId: sampleTaskId, choiceId: choiceId, selections: selections});

export const getChoiceMetadata = () => actions.getChoiceMetadata({});

export const getSelectionMetadata = () => actions.getSelectionMetadata({});

export const getStepMetadata = () => actions.getStepMetadata({});

export const updateChoiceMetadata = (keyword: string, choiceId: number) => actions.updateChoiceMetadata({
   keyword: keyword, choiceId: choiceId});

export const updateSelectionMetadata = (keyword: string, selectionId: number, frequency?: number) => actions.updateSelectionMetadata({
   keyword: keyword, selectionId: selectionId, frequency: frequency});

export const updateStepMetadata = (keyword: string, stepId: number) => actions.updateStepMetadata({
   keyword: keyword, stepId: stepId});

export const removeChoiceMetadata = (keywords: string[]) => actions.removeChoiceMetadata({
   keywords: keywords});

export const removeSelectionMetadata = (keywords: string[]) => actions.removeSelectionMetadata({
   keywords: keywords});

export const removeStepMetadata = (keywords: string[]) => actions.removeStepMetadata({
   keywords: keywords});

export const addStepMetadata = (keyword: string, id: number) => actions.addStepMetadata({
   keyword: keyword, id: id});

export const addChoiceMetadata = (keyword: string, id: number) => actions.addChoiceMetadata({
   keyword: keyword, id: id});

export const addSelectionMetadata = (keyword: string, id: number) => actions.addSelectionMetadata({
   keyword: keyword, id: id});
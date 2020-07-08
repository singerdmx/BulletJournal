import {ContentType} from "../myBuJo/constants";

export enum ProjectType {
    TODO = 'TODO',
    NOTE = 'NOTE',
    LEDGER = 'LEDGER',
}

export const toProjectType = (input: string) => {
    switch (input) {
        case 'TODO':
            return ProjectType.TODO;
        case 'NOTE':
            return ProjectType.NOTE;
        case 'LEDGER':
            return ProjectType.LEDGER;
        default:
            return ProjectType.TODO;
    }
};

export const toContentType = (projectType: ProjectType) => {
    switch (projectType) {
        case ProjectType.TODO:
            return ContentType.TASK;
        case ProjectType.NOTE:
            return ContentType.NOTE;
        case ProjectType.LEDGER:
            return ContentType.TRANSACTION;
        default:
            return ContentType.TASK;
    }
};

export enum ProjectItemType {
    TASK = 'TASK',
    NOTE = 'NOTE',
    TRANSACTION = 'TRANSACTION',
}

export const getProjectItemType = (input: ProjectType) => {
    switch (input) {
        case ProjectType.TODO:
            return ProjectItemType.TASK;
        case ProjectType.NOTE:
            return ProjectItemType.NOTE;
        case ProjectType.LEDGER:
            return ProjectItemType.TRANSACTION;
        default:
            return ProjectItemType.TASK;
    }
};

export enum ContentAction {
    ALL_ACTIONS = 'ALL ACTIONS',
    ADD_PROJECT = 'ADD PROJECT',
    DELETE_PROJECT = 'DELETE PROJECT',
    UPDATE_PROJECT = 'UPDATE PROJECT',
    ADD_TASK = 'ADD TASK',
    DELETE_TASK = 'DELETE TASK',
    UPDATE_TASK = 'UPDATE TASK',
    MOVE_TASK = 'MOVE TASK',
    COMPLETE_TASK = 'COMPLETE TASK',
    UNCOMPLETE_TASK = 'UNCOMPLETE TASK',
    ADD_TASK_CONTENT = 'ADD TASK CONTENT',
    DELETE_TASK_CONTENT = 'DELETE TASK CONTENT',
    UPDATE_TASK_CONTENT = 'UPDATE TASK CONTENT',
    ADD_NOTE = 'ADD NOTE',
    DELETE_NOTE = 'DELETE NOTE',
    UPDATE_NOTE = 'UPDATE NOTE',
    MOVE_NOTE = 'MOVE NOTE',
    ADD_NOTE_CONTENT = 'ADD NOTE CONTENT',
    DELETE_NOTE_CONTENT = 'DELETE NOTE CONTENT',
    UPDATE_NOTE_CONTENT = 'UPDATE NOTE CONTENT',
    ADD_TRANSACTION = 'ADD TRANSACTION',
    DELETE_TRANSACTION = 'DELETE TRANSACTION',
    UPDATE_TRANSACTION = 'UPDATE TRANSACTION',
    MOVE_TRANSACTION = 'MOVE TRANSACTION',
    ADD_TRANSACTION_CONTENT = 'ADD TRANSACTION CONTENT',
    DELETE_TRANSACTION_CONTENT = 'DELETE TRANSACTION CONTENT',
    UPDATE_TRANSACTION_CONTENT = 'UPDATE TRANSACTION CONTENT',
    SHARE = 'SHARE'
}

export const completedTaskPageSize = 50;

export enum ProjectItemUIType {
    TODAY,
    LABEL,
    OWNER,
    ORDER,
    PROJECT,
    RECENT,
    PAYER,
    ASSIGNEE,
    PAGE,
    COMPLETE_TASK
}

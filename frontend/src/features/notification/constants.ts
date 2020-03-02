export enum ActionType {
    Accept = 'Accept',
    Decline = 'Decline',
}

export enum EventType {
    JoinGroupEvent = 'JoinGroupEvent',
    RemoveUserFromGroupEvent = 'RemoveUserFromGroupEvent',
    DeleteGroupEvent = 'DeleteGroupEvent',
    JoinGroupResponseEvent = 'JoinGroupResponseEvent',
    RemoveNoteEvent = 'RemoveNoteEvent',
    RemoveProjectEvent = 'RemoveProjectEvent',
    RemoveTaskEvent = 'RemoveTaskEvent',
    RemoveTransactionEvent = 'RemoveTransactionEvent',
    UpdateTaskAssigneeEvent = 'UpdateTaskAssigneeEvent',
    UpdateTransactionPayerEvent = 'UpdateTransactionPayerEvent'
}
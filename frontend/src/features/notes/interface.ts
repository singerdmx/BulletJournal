export interface Note {
    id: number,
    name: string,
    projectId: number,
    subNotes: Note[]
}
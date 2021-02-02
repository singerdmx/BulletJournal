import { ProjectItem } from "../myBuJo/interface";

export interface Note extends ProjectItem {
    subNotes: Note[],
    location: string,
    color: string | undefined,
}

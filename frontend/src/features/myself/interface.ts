import {Category, Selection} from "../templates/interface";
import {Project} from "../project/interface";

export interface SubscribedCategory {
    category: Category;
    selections: Selection[];
    projects: Project[];
}
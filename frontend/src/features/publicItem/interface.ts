import {Content, ProjectItem} from "../myBuJo/interface";
import {ContentType} from "../myBuJo/constants";

export interface PublicProjectItem {
    contents: Content[];
    contentType: ContentType;
    projectItem: ProjectItem;
}
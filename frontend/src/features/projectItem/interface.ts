import {User} from "../group/interface";
import {ContentAction} from "../project/constants";
import {ProjectItem} from "../myBuJo/interface";

export interface ProjectItemActivity {
    originator: User;
    activity: string;
    activityTime: string;
    action: ContentAction;
    afterActivity: ActivityObject;
    beforeActivity: ActivityObject;
}

export interface ActivityObject {
    projectItem?: ProjectItem;
    content?: Object;
}
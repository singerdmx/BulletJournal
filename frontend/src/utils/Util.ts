import {User} from "../features/group/interface";
import {ProjectItem} from "../features/myBuJo/interface";

export const isSubsequence = (longS: string, shortS: string) => {
    longS = longS.toLowerCase();
    shortS = shortS.toLowerCase();
    if (shortS.length === 0) {
        return true;
    }
    let i = 0;
    let j = 0;
    while (i < shortS.length && j < longS.length) {
        if (shortS.charAt(i) === longS.charAt(j++)) {
            i++;
        }
        if (i === shortS.length) {
            return true;
        }
    }
    return false;
}

export const onFilterUser = (u: User, value: string) => {
    return isSubsequence(u.name.toLowerCase(), value) || isSubsequence(u.alias.toLowerCase(), value);
}

export const onFilterAssignees = (inputValue: string, option: any) => {
    inputValue = inputValue.toLowerCase();
    return isSubsequence(option.key.toString().toLowerCase(), inputValue)
        || isSubsequence(option.value.toString().toLowerCase(), inputValue);
};

export const onFilterLabel = (inputValue: string, option: any) => {
    inputValue = inputValue.toLowerCase();
    return isSubsequence(option.key.toString().toLowerCase(), inputValue);
}

export const includeProjectItem = (labelsToKeep: number[], labelsToRemove: number[], item: ProjectItem) => {
    const labels = item.labels.map(l => l.id);
    if (labels.filter(l => labelsToRemove.includes(l)).length > 0) {
        return false;
    }

    if (labelsToKeep.length === 0) {
        return true;
    }

    // labelsToKeep.length > 0
    if (labels.filter(l => labelsToKeep.includes(l)).length === 0) {
        return false;
    }
    return true;
}

const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const randomString = (length: number) => {
    let result = '';
    for (let i = length; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green',
    'cyan', 'blue', 'geekblue', 'purple'];

export function stringToRGB(str: string) {
    let hash: number = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[hash % colors.length];
}

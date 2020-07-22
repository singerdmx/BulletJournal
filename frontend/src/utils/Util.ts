import {User} from "../features/group/interface";

const isSubsequence = (longS: string, shortS: string) => {
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
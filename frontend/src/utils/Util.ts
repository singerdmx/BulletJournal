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

export default isSubsequence;
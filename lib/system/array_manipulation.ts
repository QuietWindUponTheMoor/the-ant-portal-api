


export function convertToArray(string: string): Array<any> {
    return string.replace(/,\s*$/, "").split(",");
}
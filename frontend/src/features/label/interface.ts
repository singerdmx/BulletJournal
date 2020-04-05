export interface Label {
    id: number;
    value: string;
    icon: string;
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
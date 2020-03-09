export interface Label {
  id: number;
  value: string;
  icon: string;
}

export function stringToRGB(str: string) {
  let hash: number = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let c = (hash & 0x00FFFFFF)
      .toString(16)
      .toUpperCase()
  return '#' + '00000'.substring(0, 6 - c.length) + c;
}
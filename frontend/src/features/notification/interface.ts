export interface Originator {
    id: number;
    name: string;
    thumbnail: string;
    avatar: string;
  }
  
  export interface Notification {
    id: number;
    title: string;
    content: string;
    timestamp: number;
    originator: Originator;
    actions: Array<string>;
    type: string;
    link: string;
  }
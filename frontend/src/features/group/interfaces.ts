export interface User {
    accepted: boolean;
    avatar: string;
    id: number;
    name: string;
    thumbnail: string;
  };

  export interface Group {
    id: number;
    name: string;
    owner: string;
    users: User[];
  };

  export interface GroupsWithOwner {
    owner: string;
    groups: Group[];
  };
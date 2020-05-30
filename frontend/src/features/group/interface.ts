export interface User {
  accepted: boolean;
  avatar: string;
  id: number;
  name: string;
  alias: string;
  thumbnail: string;
}

export interface Group {
  id: number;
  name: string;
  owner: User;
  users: User[];
  default: boolean;
}

export interface GroupsWithOwner {
  owner: User;
  groups: Group[];
}

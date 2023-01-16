import { IUser } from './helper';

let USERS_TABLE: IUser[] = [];

const setUsers = (data: IUser[]): void => {
	USERS_TABLE = data;
};

export { USERS_TABLE, setUsers };
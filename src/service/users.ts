import { IUser, IUserShort } from "helper";
import { v4 as uuid } from 'uuid';

let USERS_TABLE: IUser[] = [];

const getAllUsersFromDB = (): IUser[] => {
	return [...USERS_TABLE];
};

const getUserFromDBByID = (id: string): IUser | null => {
	const user = USERS_TABLE.filter((item) => item.id === id);
	return user.length ? user[0] : null;
};

const addNewUserIntoDB = (userData: IUser): IUser => {
    const newUser = {
        id :        uuid(),
        username:   userData.username,
        age:        userData.age,
        hobbies:    userData.hobbies
    }
    USERS_TABLE = [...USERS_TABLE, newUser];
    return newUser;
};

const updateUserInBDByID = (id: string, userData: IUserShort): IUser | null => {
	const userIndexInBD = USERS_TABLE.findIndex((item) => item.id === id);
	if (userIndexInBD !== -1) {
		const user = USERS_TABLE[userIndexInBD];
		USERS_TABLE[userIndexInBD] = { ...user, ...userData };
		return USERS_TABLE[userIndexInBD];
	} else {
		return null;
	}
};

const deleteUserInBDByID = async (id: string): Promise<boolean> => {
	const usersCountBefore = USERS_TABLE.length;
    USERS_TABLE = USERS_TABLE.filter((item) => item.id !== id);
    return Boolean(usersCountBefore !== USERS_TABLE.length);
};

export { 
    getAllUsersFromDB,
    getUserFromDBByID,
    addNewUserIntoDB,
    updateUserInBDByID,
    deleteUserInBDByID,
}
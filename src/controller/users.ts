import http from 'http';
import { 
	parseURL, 
	parseBody, 
	isValidUserData, 
	SERVER_RESPONSE_CODES, 
	SERVER_RESPONSE_MESSAGES, 
	Data, 
	IUser, 
	IUserShort, 
	sendServerResponse 
} from '../helper';
import { 
	addNewUserIntoDB, 
	deleteUserInBDByID, 
	getAllUsersFromDB, 
	getUserFromDBByID, 
	updateUserInBDByID 
} from '../service/users';
import { validate } from 'uuid';

const addNewUser = async (
	req: http.IncomingMessage,
	res: http.ServerResponse<http.IncomingMessage>,
): Promise<void> => {
	
    const userData: IUserShort | null = await parseBody(req);
	
    if (!userData || !isValidUserData(userData as IUser)) {
		sendServerResponse(res, SERVER_RESPONSE_CODES.BAD_RESPONSE_BAD_REQUEST, SERVER_RESPONSE_MESSAGES.INVALID_FIELDS);
		return;
	}

	const newUser = addNewUserIntoDB(userData as IUser);
    
	sendServerResponse(res, SERVER_RESPONSE_CODES.NORMAL_RESPOSE_POST, newUser);
	return;
};

const deleteUser = async (
	req: http.IncomingMessage,
	res: http.ServerResponse<http.IncomingMessage>,
): Promise<void> => {

	const id: string = await parseURL(req);

	if (!id) {
		sendServerResponse(res, SERVER_RESPONSE_CODES.BAD_RESPONSE_BAD_REQUEST, SERVER_RESPONSE_MESSAGES.INVALID_ID);
		return;
	}

	if (!validate(id)) {
		sendServerResponse(res, SERVER_RESPONSE_CODES.BAD_RESPONSE_NOT_UUID, SERVER_RESPONSE_MESSAGES.INVALID_UUID);
		return;
	}

	const isDeleted = await deleteUserInBDByID(id);

	if (isDeleted) {
		sendServerResponse(res, SERVER_RESPONSE_CODES.NORMAL_RESPOSE_DELETE, SERVER_RESPONSE_MESSAGES.USER_DELETED);
		return;
	} else {
		sendServerResponse(res, SERVER_RESPONSE_CODES.BAD_RESPONSE_NOT_FOUND, SERVER_RESPONSE_MESSAGES.USER_NOT_FOUND);
		return;
	}
};

const getAllUsers = async (
	req: http.IncomingMessage,
	res: http.ServerResponse<http.IncomingMessage>,
): Promise<void> => {

	const users = getAllUsersFromDB();
	
    if (users) {
		sendServerResponse(res, SERVER_RESPONSE_CODES.NORMAL_RESPOSE_GET, users);
		return;
	}
};

const getUser = async (
	req: http.IncomingMessage,
	res: http.ServerResponse<http.IncomingMessage>,
): Promise<void> => {

	const id: string = await parseURL(req);

	if (!validate(id)) {
		sendServerResponse(res, SERVER_RESPONSE_CODES.BAD_RESPONSE_NOT_UUID, SERVER_RESPONSE_MESSAGES.INVALID_UUID);
		return;
	}

	const user = getUserFromDBByID(id) as unknown as Data;

	if (!user) {
		sendServerResponse(res, SERVER_RESPONSE_CODES.BAD_RESPONSE_NOT_UUID, SERVER_RESPONSE_MESSAGES.USER_NOT_FOUND);
		return;
	}

	sendServerResponse(res, SERVER_RESPONSE_CODES.NORMAL_RESPOSE_GET, user);
	return;
};

const updateUser = async (
	req: http.IncomingMessage,
	res: http.ServerResponse<http.IncomingMessage>,
): Promise<void> => {
	
    const id: string = await parseURL(req);
	const userData: IUserShort | null = await parseBody(req);

	if (!userData) {
		sendServerResponse(res, SERVER_RESPONSE_CODES.BAD_RESPONSE_BAD_REQUEST, SERVER_RESPONSE_MESSAGES.INVALID_FIELDS);
		return;
	}

	if (!validate(id)) {
		sendServerResponse(res, SERVER_RESPONSE_CODES.BAD_RESPONSE_NOT_UUID, SERVER_RESPONSE_MESSAGES.INVALID_UUID);
		return;
	}

	if (!isValidUserData(userData as IUser)) {
		sendServerResponse(res, SERVER_RESPONSE_CODES.BAD_RESPONSE_BAD_REQUEST, SERVER_RESPONSE_MESSAGES.INVALID_FIELDS);
		return;
	}

	const user = updateUserInBDByID(id, userData as IUserShort);

	if (!user) {
		sendServerResponse(res, SERVER_RESPONSE_CODES.BAD_RESPONSE_NOT_FOUND, SERVER_RESPONSE_MESSAGES.USER_NOT_FOUND);
		return;
	}

	sendServerResponse(res, SERVER_RESPONSE_CODES.NORMAL_RESPOSE_PUT, user);
	return;
};

export { addNewUser, deleteUser, getAllUsers, getUser, updateUser };
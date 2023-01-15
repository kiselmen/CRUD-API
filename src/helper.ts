import { IncomingMessage, ServerResponse } from "http";

type Data = IUser[] | IUser| string;

interface IUser {
    id: string;
    username: string;
    age: number;
    hobbies: String[] | [];
}

interface IUserShort {
    username?: string;
    age?: number;
    hobbies?: String[] | [];
}

const SERVER_ENDPOINT = '/api/users';

enum SERVER_REQUEST_METHODS {
	POST = 'POST',
	GET = 'GET',
	DELETE = 'DELETE',
	PUT = 'PUT',
}

enum SERVER_RESPONSE_CODES {
	NORMAL_RESPOSE_POST = 201,
	NORMAL_RESPOSE_GET = 200,
	NORMAL_RESPOSE_DELETE = 204,
	NORMAL_RESPOSE_PUT = 200,
	BAD_RESPONSE_NOT_FOUND = 404,
	BAD_RESPONSE_BAD_REQUEST = 400,
	BAD_RESPONSE_SERVER_ERROR = 500,
	BAD_RESPONSE_NOT_UUID = 400,
}

enum SERVER_RESPONSE_MESSAGES {
	USER_NOT_FOUND = 'User not found',
	USER_DELETED = 'User was successfully deleted',
	SERVER_ERROR = 'Server error',
	PAGE_NOT_FOUND = 'Page not found',
	UNKNOWN_METHOD = 'Unknown method',
	INVALID_UUID = 'UserId is not uuid',
    INVALID_FIELDS = 'Required fields is missing',
    INVALID_ID = 'Required field: "id" is missing',
}

const sendServerResponse = (incomingMessage: ServerResponse<IncomingMessage>, responseCode: number, responseData: Data): void => {
    incomingMessage.writeHead(responseCode, { "Content-Type": "application/json" });
    incomingMessage.end(JSON.stringify(responseData));
}

const parseURL = async (req: IncomingMessage): Promise<string> => {
	const url = req.url as string;
	return url.replace(SERVER_ENDPOINT + '/', '');
};

const parseBody = async (req: IncomingMessage): Promise<IUserShort | null> => {
	const readData = [];

	for await (const chunk of req) {
		readData.push(chunk);
	}

	const data = Buffer.concat(readData).toString();

	try {
		return JSON.parse(data);
	} catch (error) {
		return null;
	}
}

const isValidUserData = (user: IUserShort): boolean => {
    return Boolean(user && (user.username || user.age || user.hobbies));
} 

export { 
    Data, 
    IUser, IUserShort,
    SERVER_RESPONSE_CODES, 
    SERVER_RESPONSE_MESSAGES, 
    SERVER_ENDPOINT, 
    SERVER_REQUEST_METHODS,
    sendServerResponse,
    parseURL,
    parseBody, 
    isValidUserData,
}
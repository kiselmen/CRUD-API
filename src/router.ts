import { 
    SERVER_ENDPOINT, 
    SERVER_REQUEST_METHODS, 
    SERVER_RESPONSE_CODES, 
    SERVER_RESPONSE_MESSAGES, 
    sendServerResponse 
} from "./helper";
import { IncomingMessage, ServerResponse } from "http";
import { 
    addNewUser, 
    deleteUser, 
    getAllUsers, 
    getUser, 
    updateUser 
} from "./controller/users";

const serverRouter = async (req: IncomingMessage, res: ServerResponse<IncomingMessage>): Promise<void> => {
	try {
        if (req.method === SERVER_REQUEST_METHODS.GET) {
            if (req.url === SERVER_ENDPOINT) {
                await getAllUsers(req, res);
            } else {
                await getUser(req, res);
            }
        } else if (req.method === SERVER_REQUEST_METHODS.POST) {
            await addNewUser(req, res);
        } else if (req.method === SERVER_REQUEST_METHODS.PUT) {
            await updateUser(req, res);
        } else if (req.method === SERVER_REQUEST_METHODS.DELETE) {
            await deleteUser(req, res);
        } else {
            sendServerResponse(res, SERVER_RESPONSE_CODES.BAD_RESPONSE_NOT_FOUND, SERVER_RESPONSE_MESSAGES.UNKNOWN_METHOD);
        }    
	} catch (error) {
		sendServerResponse(res, SERVER_RESPONSE_CODES.BAD_RESPONSE_SERVER_ERROR, SERVER_RESPONSE_MESSAGES.SERVER_ERROR);
	}
}

export { serverRouter }
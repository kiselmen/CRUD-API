import { createServer } from "http";
import { 
    SERVER_RESPONSE_CODES, 
    SERVER_RESPONSE_MESSAGES, 
    SERVER_ENDPOINT, 
    sendServerResponse 
} from "./helper";
import { serverRouter } from './router';

const server = createServer(async (req, res) => {
    try{
        // console.log(req.url);
		if (!req.url) {
			sendServerResponse(res, SERVER_RESPONSE_CODES.BAD_RESPONSE_NOT_FOUND, SERVER_RESPONSE_MESSAGES.PAGE_NOT_FOUND);
			return;
		}

		if (!req.method) {
			sendServerResponse(res, SERVER_RESPONSE_CODES.BAD_RESPONSE_NOT_FOUND, SERVER_RESPONSE_MESSAGES.UNKNOWN_METHOD);
			return;
		}

		if (req.url && !req.url.startsWith(SERVER_ENDPOINT)) {
			sendServerResponse(res, SERVER_RESPONSE_CODES.BAD_RESPONSE_NOT_FOUND, SERVER_RESPONSE_MESSAGES.PAGE_NOT_FOUND);
			return;
		}

		await serverRouter(req, res);
    } catch (err) {
        sendServerResponse(res, SERVER_RESPONSE_CODES.BAD_RESPONSE_SERVER_ERROR, SERVER_RESPONSE_MESSAGES.SERVER_ERROR);
    }
});

export default server
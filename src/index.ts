import "dotenv/config";
import server from './server';

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => console.log(`Sever is running on the port: ${PORT}`));
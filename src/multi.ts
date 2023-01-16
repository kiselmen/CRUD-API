import cluster from 'node:cluster';
import process from 'node:process';
import { env } from 'node:process';
import { cpus } from 'node:os';
import { config } from 'dotenv';
import server from './server';
import { IUser } from './helper';
import { setUsers } from './db';

const PORT = process.env.PORT || 4000;
const CPUs = cpus().length;
env.MODE = 'multi';

if (cluster.isPrimary) {
	console.log(`Primary ${process.pid} is running`);

	for (let i = 0; i < CPUs; i++) {
		cluster.schedulingPolicy = cluster.SCHED_NONE;
		cluster.fork({ workerPort: Number(PORT) + i + 1 });
	}

	cluster.on('fork', (worker) => {
		console.log(`${worker.id} is running`);
	});

	cluster.on('message', (worker, message: { users: IUser[] }) => {
		setUsers(message.users);
		if (cluster.workers) {
			const workers = Object.values(cluster.workers);
			workers.forEach((worker) => {
				worker?.send(message);
			});
		}
	});

	cluster.on('exit', (worker) => {
		console.log(`The worker ${worker.id} died`);
		cluster.fork();
	});
	server.listen(PORT, () => console.log(`Sever is running on the port: ${PORT}`));
} else {
	server.listen(process.env.workerPort, () =>
		console.log(`Sever is running on the port: ${process.env.workerPort}`),
	);
	console.log(`Worker ${process.pid} started`);
}

process.on('message', (message: { users: IUser[] }) => {
	setUsers(message.users);
});
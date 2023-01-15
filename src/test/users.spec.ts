import { Server, IncomingMessage, ServerResponse } from 'http';
import server from '../server';
import request from 'supertest';

let application: Server<typeof IncomingMessage, typeof ServerResponse>;

beforeEach(async () => {
	jest.setTimeout(60000);
	application = server;
});

describe('Add new user and try to add user with invalid data', () => {
	it('Server should answer with status code 201 and newly created user', async () => {
		const newValidUser = await request(application)
			.post('/api/users')
			.send({
				username: 'Vasili',
				age: '45',
				hobbies: ['mafia'],
			});
		expect(newValidUser.statusCode).toBe(201);
		expect(newValidUser.body).toMatchObject({ username: 'Vasili' });
		expect(newValidUser.body).toMatchObject({ age: '45' });
		expect(newValidUser.body).toMatchObject({ hobbies: ['mafia'] });
	}, 60000);

	it('Server should answer with status code 400 and corresponding message if request body does not contain required fields', async () => {
		const newInvalidUser = await request(application)
			.post('/api/users')
			.send({
				age: '45',
				hobbies: ['mafia'],
			});
		expect(newInvalidUser.statusCode).toBe(400);
		expect(newInvalidUser.body).toEqual('Required fields is missing');
	}, 60000);
});

describe('Add new user, delete user and try delete with invalid ID or non-existent user', () => {
	it('Server should answer with status code 204 if the user was founded and deleted', async () => {
		const newValidUser = await request(application)
			.post('/api/users')
			.send({
				username: 'Ivan',
				age: '25',
				hobbies: ['coffe'],
			});

		expect(newValidUser.body).toMatchObject({ username: 'Ivan' });
		expect(newValidUser.body).toMatchObject({ age: '25' });
		expect(newValidUser.body).toMatchObject({ hobbies: ['coffe'] });

		const id = newValidUser.body.id;

		const deleteValidUser = await request(application).delete(`/api/users/${id}`);
		expect(deleteValidUser.statusCode).toBe(204);
	}, 60000);

	it('Server should answer with status code 400 if id was not found', async () => {
		const deleteInvalidRequest = await request(application).delete('/api/users/');
		expect(deleteInvalidRequest.statusCode).toBe(400);
		expect(deleteInvalidRequest.body).toEqual('Required field: "id" is missing');
	}, 60000);

	it('Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)', async () => {
		const newValidUser = await request(application)
			.post('/api/users')
			.send({
				username: 'Vasili',
				age: '45',
				hobbies: ['mafia'],
			});

		expect(newValidUser.body).toMatchObject({ username: 'Vasili' });
		expect(newValidUser.body).toMatchObject({ age: '45' });
		expect(newValidUser.body).toMatchObject({ hobbies: ['mafia'] });

		const id = newValidUser.body.id;

		const deleteInvalidID = await request(application).delete(`/api/users/${id}123`);
		expect(deleteInvalidID.statusCode).toBe(400);
		expect(deleteInvalidID.body).toEqual('UserId is not uuid');
	}, 60000);

	it('Server should answer with status code 404 and corresponding message if record with id === userId does not exist', async () => {
		const newValidUser = await request(application)
			.post('/api/users')
			.send({
				username: 'Vasili',
				age: '45',
				hobbies: ['mafia'],
			});

		expect(newValidUser.body).toMatchObject({ username: 'Vasili' });
		expect(newValidUser.body).toMatchObject({ age: '45' });
		expect(newValidUser.body).toMatchObject({ hobbies: ['mafia'] });

		const id = newValidUser.body.id;

		await request(application).delete(`/api/users/${id}`);

		const deleteUserNotFound = await request(application).delete(`/api/users/${id}`);
		expect(deleteUserNotFound.statusCode).toBe(404);
		expect(deleteUserNotFound.body).toEqual('User not found');
	}, 60000);
});


describe('Add new user, update user and try update user with invalid data', () => {
	it('Server should answer with status code 200 and updated user', async () => {
		const newValidUser = await request(application)
			.post('/api/users')
			.send({
				username: 'Vasili',
				age: '45',
				hobbies: ['mafia'],
			});
		expect(newValidUser.statusCode).toBe(201);
		expect(newValidUser.body).toMatchObject({ username: 'Vasili' });
		expect(newValidUser.body).toMatchObject({ age: '45' });
		expect(newValidUser.body).toMatchObject({ hobbies: ['mafia'] });

		const id = newValidUser.body.id;

		const updateUser = await request(application)
			.put(`/api/users/${id}`)
			.send({
				username: 'Ivan',
				age: '25',
				hobbies: ['coffe'],
			});
		expect(updateUser.statusCode).toBe(200);
		expect(updateUser.body).toMatchObject({ username: 'Ivan' });
		expect(updateUser.body).toMatchObject({ age: '25' });
		expect(updateUser.body).toMatchObject({ hobbies: ['coffe'] });

	}, 60000);

	it('Server should answer with status code 400 and corresponding message if userId is invalid', async () => {
		const newValidUser = await request(application)
			.post('/api/users')
			.send({
				username: 'Vasili',
				age: '45',
				hobbies: ['mafia'],
			});
		expect(newValidUser.statusCode).toBe(201);
		expect(newValidUser.body).toMatchObject({ username: 'Vasili' });
		expect(newValidUser.body).toMatchObject({ age: '45' });
		expect(newValidUser.body).toMatchObject({ hobbies: ['mafia'] });

		const id = newValidUser.body.id;

		const updateUserInvalidID = await request(application)
			.put(`/api/users/${id}123`)
			.send({
				username: 'Ivan',
				age: '25',
				hobbies: ['coffe'],
			});
			expect(updateUserInvalidID.statusCode).toBe(400);
			expect(updateUserInvalidID.body).toEqual('UserId is not uuid');
	}, 60000);
	
	it('Server should answer with status code 400 and corresponding message if userId is invalid', async () => {
		const newValidUser = await request(application)
			.post('/api/users')
			.send({
				username: 'Vasili',
				age: '45',
				hobbies: ['mafia'],
			});
		expect(newValidUser.statusCode).toBe(201);
		expect(newValidUser.body).toMatchObject({ username: 'Vasili' });
		expect(newValidUser.body).toMatchObject({ age: '45' });
		expect(newValidUser.body).toMatchObject({ hobbies: ['mafia'] });
	
		const id = newValidUser.body.id;

		const updateUserInvalidURL = await request(application)
			.put(`/api/users/`)
			.send({
				username: 'Ivan',
				age: '25',
				hobbies: ['coffe'],
			});
		expect(updateUserInvalidURL.statusCode).toBe(400);
		expect(updateUserInvalidURL.body).toEqual('UserId is not uuid');

	}, 60000);

	it('Server should answer with status code 404 and corresponding message if record with id === userId does not exist', async () => {
		const newValidUser = await request(application)
			.post('/api/users')
			.send({
				username: 'Vasili',
				age: '45',
				hobbies: ['mafia'],
			});
		expect(newValidUser.statusCode).toBe(201);
		expect(newValidUser.body).toMatchObject({ username: 'Vasili' });
		expect(newValidUser.body).toMatchObject({ age: '45' });
		expect(newValidUser.body).toMatchObject({ hobbies: ['mafia'] });
	
		const id = newValidUser.body.id;
		await request(application).delete(`/api/users/${id}`);

		const updateUserNotFound = await request(application).delete(`/api/users/${id}`);
		expect(updateUserNotFound.statusCode).toBe(404);
		expect(updateUserNotFound.body).toEqual('User not found');
	
	}, 60000);
});

afterEach(async () => {
	application.close();
});
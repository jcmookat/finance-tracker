import { hashSync } from 'bcrypt-ts-edge';

const sampleData = {
	users: [
		{
			name: 'Grasya Ganda',
			email: 'grasya@example.com',
			password: hashSync('123456', 10),
			role: 'admin',
		},
		{
			name: 'Mukat Buldang',
			email: 'mukat@example.com',
			password: hashSync('123456', 10),
			role: 'user',
		},
	],
};

export default sampleData;

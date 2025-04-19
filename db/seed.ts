import { PrismaClient } from '../lib/generated/prisma';
import sampleData from './sample-data';

async function main() {
	const prisma = new PrismaClient();

	try {
		await prisma.account.deleteMany();
		await prisma.session.deleteMany();
		await prisma.verificationToken.deleteMany();
		await prisma.user.deleteMany();
		await prisma.user.createMany({ data: sampleData.users });
		console.log('Database seeded successfully!');
	} catch (error) {
		console.error('Error seeding database:', error);
		throw error;
	} finally {
		// Disconnect from the database when done
		await prisma.$disconnect();
	}
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});

import { PrismaClient } from '../lib/generated/prisma';

async function main() {
	const prisma = new PrismaClient();
	const user = await prisma.user.findFirst({
		where: {
			id: '2001c757-f42c-4a8f-a4e4-b9e4293a9dcd',
		},
	});
	if (!user) {
		console.error('No user found. Seed a user first!');
		return;
	}

	try {
		await prisma.category.createMany({
			data: [
				{
					name: 'Salary',
					userId: user.id,
					type: 'INCOME',
					icon: 'Briefcase',
				},
			],
		});
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

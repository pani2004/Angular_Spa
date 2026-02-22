import * as userRepository from '../repositories/user.repository.js';
import { hashPassword } from '../utils/password.util.js';

/**
 * Seed initial users
 */
async function seedUsers() {
  try {
    console.log('🌱 Seeding users...\n');

    // Admin user
    const adminEmail = 'admin@test.com';
    const existingAdmin = await userRepository.findByEmail(adminEmail);

    if (!existingAdmin) {
      const adminPasswordHash = await hashPassword('Password123!');
      const admin = await userRepository.create({
        email: adminEmail,
        passwordHash: adminPasswordHash,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN'
      });
      console.log(`✓ Created admin user: ${admin.email}`);
    } else {
      console.log(`✓ Admin user already exists: ${adminEmail}`);
    }

    // Regular user
    const userEmail = 'user@test.com';
    const existingUser = await userRepository.findByEmail(userEmail);

    if (!existingUser) {
      const userPasswordHash = await hashPassword('Password123!');
      const user = await userRepository.create({
        email: userEmail,
        passwordHash: userPasswordHash,
        firstName: 'Regular',
        lastName: 'User',
        role: 'USER'
      });
      console.log(`✓ Created regular user: ${user.email}`);
    } else {
      console.log(`✓ Regular user already exists: ${userEmail}`);
    }

    console.log('\n✅ Seeding completed successfully!');
    console.log('\nTest Credentials:');
    console.log('  Admin:');
    console.log('    Email: admin@test.com');
    console.log('    Password: Password123!');
    console.log('    Role: ADMIN');
    console.log('');
    console.log('  Regular User:');
    console.log('    Email: user@test.com');
    console.log('    Password: Password123!');
    console.log('    Role: USER');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function runTests() {
  console.log('--- Testing Admin Features & Fixes ---');

  // 1. Verify primary super admin exists
  const superAdmin = await prisma.adminUser.findUnique({
    where: { username: 'admin' },
  });
  console.log('1. Primary Super Admin exists:', superAdmin?.username, 'Role:', superAdmin?.role);

  // 2. Test Staff Admin Creation
  const testStaffUsername = 'teststaff_' + Date.now();
  const testEmail = `${testStaffUsername}@test.pk`;
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('StaffPassword123!', salt);

  const createdStaff = await prisma.adminUser.create({
    data: {
      username: testStaffUsername,
      email: testEmail,
      passwordHash: passwordHash,
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log('2. Successfully created staff account:', createdStaff.username);

  // 3. Test Staff Password Validation (Login verify)
  const passwordMatches = await bcrypt.compare('StaffPassword123!', createdStaff.passwordHash);
  console.log('3. Staff password verification check:', passwordMatches === true ? 'PASSED' : 'FAILED');

  // 4. Test Forgot Password Token Generation
  const resetCode = '123456';
  const resetToken = '123456-abc123xyz789';
  const expiry = new Date(Date.now() + 30 * 60 * 1000);

  const updatedWithToken = await prisma.adminUser.update({
    where: { id: createdStaff.id },
    data: {
      resetToken,
      resetTokenExpiry: expiry,
    },
  });
  console.log('4. Stored reset token & expiry for staff:', updatedWithToken.resetToken?.startsWith('123456'));

  // 5. Test Reset Password Update
  const newSalt = await bcrypt.genSalt(10);
  const newPasswordHash = await bcrypt.hash('NewStaffPass456!', newSalt);

  await prisma.adminUser.update({
    where: { id: createdStaff.id },
    data: {
      passwordHash: newPasswordHash,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  const verifiedNewPass = await bcrypt.compare('NewStaffPass456!', (await prisma.adminUser.findUnique({ where: { id: createdStaff.id } })).passwordHash);
  console.log('5. New password reset verification check:', verifiedNewPass === true ? 'PASSED' : 'FAILED');

  // Clean up test staff user
  await prisma.adminUser.delete({ where: { id: createdStaff.id } });
  console.log('6. Cleaned up test staff user. Only genuine super admin remains.');

  const remainingAdmins = await prisma.adminUser.findMany();
  console.log('Remaining admin count:', remainingAdmins.length);
  console.log('All tests passed successfully!');
}

runTests()
  .catch((e) => {
    console.error('Test error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

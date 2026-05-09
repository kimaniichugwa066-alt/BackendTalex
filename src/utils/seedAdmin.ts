import bcrypt from 'bcryptjs';
import prisma from '../prisma/client';

export const createDefaultAdmin = async () => {
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@talex.com';
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin123@';
  const adminName = process.env.DEFAULT_ADMIN_NAME || 'Talex Admin';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`✅ Default admin already exists: ${adminEmail}`);
    return existingAdmin;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
      isVerified: true,
    },
  });

  console.log('✅ Default admin created successfully');
  console.log('📧 Email:', adminEmail);
  console.log('🔑 Password:', adminPassword);
  return admin;
};

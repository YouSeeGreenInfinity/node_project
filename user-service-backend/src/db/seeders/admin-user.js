'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('Admin123', 10);
    
    const users = [
      {
        firstName: 'Админ',
        lastName: 'Системный',
        middleName: null,
        birthDate: new Date('1985-01-01'),
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Менеджер',
        lastName: 'Проектов',
        middleName: 'Иванович',
        birthDate: new Date('1990-05-15'),
        email: 'manager@example.com',
        password: hashedPassword,
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('Users', users);
    console.log('✅ Seed users created successfully');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      email: {
        [Sequelize.Op.in]: ['admin@example.com', 'manager@example.com']
      }
    }, {});
    console.log('✅ Seed users removed successfully');
  }
};
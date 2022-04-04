'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'users',
      'avatar',
      {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: "media/avatars/default.png"
      },
      {
        after: 'password'
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'avatar');
  }
};

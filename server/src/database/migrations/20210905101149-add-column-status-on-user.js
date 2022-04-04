'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'users',
      'status',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: "1"
      },
      {
        after: 'avatar'
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'status');
  }
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'photos',
      'status',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: "1"
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('photos', 'status');
  }
};

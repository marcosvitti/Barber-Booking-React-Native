'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'barbers',
      'latitude',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
      {
        after: 'avatar'
      }
    );

    await queryInterface.addColumn(
      'barbers',
      'longitude',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
      {
        after: 'latitude'
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('barbers', 'latitude');
    await queryInterface.removeColumn('barbers', 'longitude');
  }
};

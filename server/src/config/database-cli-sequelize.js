module.exports = {
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'barber',
    define: {
        timestamps: true,
        underscored: true
    },
    dialectOptions: {
        useUTC: false,
        dateStrings: true,
        typeCast: function (field, next) {
            if (field.type === 'DATETIME') {
                return field.string()
            }
            return next()
          },
    },
    timezone: '-03:00'
};
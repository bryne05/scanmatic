module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  DB: "scanmaticDB",
  dialect: "mysql",
  timezone: "+08:00",

  pool: {
    max: 5, // Maximum number of connection in pool
    min: 0, // Minimum number of connection in pool
    acquire: 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
    idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released
  },
};

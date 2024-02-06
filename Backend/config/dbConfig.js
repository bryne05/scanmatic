module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  DB: "scanmaticdb",
  dialect: "mysql",
  timezone: "+08:00",

  // USER: "py4wp2pi_bryne",
  // PASSWORD: "brynE7X0",
  // DB: "py4wp2pi_scanmaticdb",
  pool: {
    max: 20, // Maximum number of connection in pool
    min: 0, // Minimum number of connection in pool
    acquire: 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
    idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released
  },
};

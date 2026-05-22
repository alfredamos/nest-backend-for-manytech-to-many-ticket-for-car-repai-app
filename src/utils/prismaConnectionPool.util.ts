function adapterParameters() {
  return {
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.DATABASE,
    connectionLimit: parseInt(process.env.CONNECTION_LIMIT as string),
    connectTimeout: parseInt(process.env.CONNECT_TIMEOUT as string),
  };
}

const parameters = adapterParameters();

export const mysqlPool = {
  host: parameters.host,
  user: parameters.user,
  password: parameters.password,
  database: parameters.database,
  connectionLimit: parameters.connectionLimit,
  bigIntAsNumber: true,
  trace: true,
};

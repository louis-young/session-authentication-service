import dotenv from "dotenv";

dotenv.config();

const knexfile = {
  client: "pg",
  connection: {
    database: process.env.DATABASE,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  },
  migrations: {
    directory: "./knex/migrations",
  },
  seeds: { directory: "./knex/seeds" },
};

export default knexfile;

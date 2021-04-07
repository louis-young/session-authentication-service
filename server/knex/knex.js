import knex from "knex";
import knexfile from "../knexfile.js";

const instance = knex(knexfile);

export { instance as knex };

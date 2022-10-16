import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { file } from "./entity/file";

dotenv.config();

const dataSource= new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASENAME,
  synchronize: true,
  logging: false,
  entities: [file],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
//   cli: {
//     entitiesDir: "src/entity",
//     migrationsDir: "src/migration",
//     subscribersDir: "src/subscriber",
//   },
});

export default dataSource;
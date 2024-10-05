import { createArtigosTable, createUserTable } from "./db"

export const createOfflineTables = () => {
  createUserTable();
  createArtigosTable();
}
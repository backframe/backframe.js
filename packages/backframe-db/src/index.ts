export class Database {
  constructor(private connString: string) {}

  connect() {
    console.log("first");
  }

  disconnect() {
    console.log("first");
  }
}

export const db = new Database(process.env.DB_URL || "hello");

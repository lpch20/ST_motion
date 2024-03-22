var mysql = require('promise-mysql');

export class ZenouraMysqlPromiseConnection {

  private connectionLimit: number = 20;
  private pool: any;
  private db_config = {};

  constructor() {
    this.pool = null;
  }

  public establishPromiseConnection(host: string, port: number, databaseName: string, user: string, password: string): any {
    if (this.pool === null) {
      this.db_config = {
        connectionLimit: this.connectionLimit,
        host: host,
        port: port,
        user: user,
        password: password,
        database: databaseName
      };
      console.log("Creando pool");
      this.pool = mysql.createPool(this.db_config);
    }
    return this.pool;
  }
}
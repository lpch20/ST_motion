import { ZenouraMysqlPromiseConnection } from '../../mysql/mysqlPromiseConnection';

export class MasterDatabasePromiseConnection {
    private zenouraMysql: ZenouraMysqlPromiseConnection;
    private connection: any;
    public databaseName: string;

    constructor(host: string, port: number, databaseName: string, userDB: string, passwordDB: string) {
        this.databaseName = databaseName;
        this.zenouraMysql = new ZenouraMysqlPromiseConnection();
        this.connection = this.zenouraMysql.establishPromiseConnection(host, port, databaseName, userDB, passwordDB);
        if (this.connection)
            console.log('Connection established on Master Database');
        else
            console.error(new Date(), 'Failed to establish connection with Master Database');
    }

    public getConnection(): any {
        return this.connection;
    }
}

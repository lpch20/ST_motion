import { ZenouraMysqlPromiseConnection } from '../../mysql/mysqlPromiseConnection'

export class ControllerDBClientsPromiseConnections {
    private host: string;
    private port: number;
    private user: string;
    private password: string;
    private connectionPool: Array<any>;

    constructor(host: string, port: number, userDB: string, passwordDB: string) {
        this.host = host;
        this.port = port;
        this.user = userDB;
        this.password = passwordDB;
        this.connectionPool = [];
    }

    public getUserConnection(databaseName: any): any {
        if (this.connectionPool[databaseName] && this.connectionPool[databaseName] !== undefined) {
            console.log(databaseName, Object.keys(this.connectionPool));
            return this.connectionPool[databaseName];
        } else {
            let zenouraMysql = new ZenouraMysqlPromiseConnection();
            var connection = zenouraMysql.establishPromiseConnection(this.host, this.port, databaseName, this.user, this.password);
            console.log('Host: ' + this.host);
            console.log('Port: ' + this.port);
            console.log('DB: ' + databaseName);

            this.connectionPool[databaseName] = connection;
            return connection;
        }
    };
}

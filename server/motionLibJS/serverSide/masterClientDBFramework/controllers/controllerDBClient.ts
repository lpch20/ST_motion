import { ZenouraMysqlConnection } from '../../mysql/mysqlConnection'

export class ControllerDBClientsConnections {
    private host: string;
    private port: number;
    private user: string;
    private password: string;
    private connectionPool: Array<any>;

    constructor(host: string, port: number, userDB: string, passwordDB: string) {
        console.log('init creation of  framework client db controller.');
        this.host = host;
        this.port = port;
        this.user = userDB;
        this.password = passwordDB;
        this.connectionPool = [];
    }

    public getUserConnection(databaseName: any): any {
        if (this.connectionPool[databaseName] && this.connectionPool[databaseName] !== undefined) {
            console.log('usando conexion con bd cliente ya existente.');
            console.log(databaseName, Object.keys(this.connectionPool));
            return this.connectionPool[databaseName];
        } else {
            console.log('intentando crear conexion cliente.');
            let zenouraMysql = new ZenouraMysqlConnection();
            var connection = zenouraMysql.establishConnection(this.host, this.port, databaseName, this.user, this.password);
            console.log('creando conexion con bd cliente.');
            console.log(this.host);
            console.log(this.port);
            console.log(databaseName);


            this.connectionPool[databaseName] = connection;
            return connection;
        }
    };
}
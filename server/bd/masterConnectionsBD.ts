import { ControllerDBMaster } from '../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';

export class MasterConnectionsBD {

    private host: string = "127.0.0.1";
    private port: number = 3306;
    private databaseName: string = "master_stmotion";
    private user: string = "root";
    private psw: string = "espanhaRoletti30!";
    private controller: ControllerDBMaster;

    constructor() {
        this.controller = new ControllerDBMaster(this.host, this.port, this.databaseName, this.user, this.psw, {});
    }

    public getController(): ControllerDBMaster {
        return this.controller;
    }
}

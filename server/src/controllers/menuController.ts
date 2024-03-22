import { MainController } from './mainController';
import { MenuModel } from '../models/menuModel';
import { UserModel } from '../models/userModel';
import { ResultCode } from '../../../datatypes/result';
import * as express from 'express';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';

export class MenuController extends MainController {
    private resource: string;
    private menuModel: MenuModel;
    private userModel: UserModel;

    constructor(masterDBController: ControllerDBMaster,
        controllerConnections: ControllerDBClientsConnections,
        controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        acl: NewACL) {
        super(masterDBController, controllerConnections, controllerPromiseConnections, acl);
        //TODO Cambiar
        this.resource = "users";
        this.menuModel = new MenuModel();
        this.userModel = new UserModel(controllerConnections);
    }

    public getMenuByRol = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            let mainThis = this;
            let con = mainThis.masterDBController.getMasterConnection().getConnection();
            this.userModel.rolByUserName(<string>req.headers['user'], con, function (response: any) {
                if (response.result > 0) {
                    let rolId = response.data[0].rol_id;
                    mainThis.menuModel.getMenuByRol(rolId, con, function (result: any) {
                        res.send(result);
                    });
                } else {
                    res.send({
                        result: ResultCode.Error,
                        message: "Error al traer el rol del usuario"
                    });
                }
            });
        });
    };
}

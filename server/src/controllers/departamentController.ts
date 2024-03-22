import { MainController } from './mainController';
import { DepartamentModel } from '../models/departaments';
import * as express from 'express';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';

export class DepartamentController extends MainController {
    private resource: string;
    private departamentModel: DepartamentModel;    

    constructor(masterDBController: ControllerDBMaster,
        controllerConnections: ControllerDBClientsConnections,
        controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        acl: NewACL) {
        super(masterDBController, controllerConnections, controllerPromiseConnections, acl);
        //TODO Cambiar
        this.resource = "users";
        this.departamentModel = new DepartamentModel(controllerConnections);        
    }

    public getAll = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.departamentModel.getAll(dbName, function (result: any) {
                res.send(result);
            });
        });
    };

    public getAllCities = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.departamentModel.getAllCities(dbName, function (result: any) {
                res.send(result);
            });
        });
    };
}

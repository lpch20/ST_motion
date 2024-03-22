import { MainController } from './mainController';
import { FiltersModel } from '../models/filtersModel';
import { Processor } from '../logic/filters/processor';
import * as express from 'express';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';

export class FiltersController extends MainController {

    private resource: string;

    constructor(masterDBController: ControllerDBMaster,
        controllerConnections: ControllerDBClientsConnections,
        controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        acl: NewACL) {
        super(masterDBController, controllerConnections, controllerPromiseConnections, acl);
        //TODO Cambiar
        this.resource = "users";
    }

    public getFilters = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            let filtersModel = new FiltersModel(dbName, this.controllerConnections);
            filtersModel.getFiltersDef((result: any) => {
                res.send(result);
            });
        });
    };

    public getFiltersProgress = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            let filtersModel = new FiltersModel(dbName, this.controllerConnections);
            filtersModel.getFilterProgress(req.params.id, (result: any) => {
                res.send(result);
            });
        });
    };

    public getCountByUsers = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            let filtersModel = new FiltersModel(dbName, this.controllerConnections);
            filtersModel.getCountByUsers(req.body.users, function (result: any) {
                res.send(result);
            });
        });
    };

    public filter = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            let filterProcessor = new Processor(dbName, this.controllerConnections);
            filterProcessor.filter(req.body.currStep, req.body.previousSteps, req.body.users, (result: any) => {
                res.send(result);
            });
        });
    };

    public apply = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            let filterProcessor = new Processor(dbName, this.controllerConnections);
            filterProcessor.apply(req.body.filters, req.body.users, req.body.reiniciar, (result: any) => {
                res.send(result);
            });
        });
    };
}
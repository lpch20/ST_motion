import { MainController } from './mainController';
import { CampaignModel } from '../models/campaignModel';
import * as express from 'express';
import { ICampaign } from '../../../datatypes/Campaign';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';

export class CampaignController extends MainController {

    private resource: string;
    private campaignModel: CampaignModel;

    constructor(masterDBController: ControllerDBMaster,
        controllerConnections: ControllerDBClientsConnections,
        controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        acl: NewACL) {
        super(masterDBController, controllerConnections, controllerPromiseConnections, acl);
        //TODO Cambiar
        this.resource = "users";
        this.campaignModel = new CampaignModel();
    }

    /**
     * Gets all the campaigns
     * @returns Promise<ICampaign[]> Returns a Promise of ICampaign[]
     */
    public getAll = async (req: express.Request): Promise<ICampaign[]> => {
        // se verifica el acceso
        return await super.verifyAccessWithPromise(this.getUser(req), this.getTokenId(req), this.getAccountId(req), this.resource)
            // se obtiene la conexion
            .then(dbName => this.getConnectionWithPromise(dbName))
            // se ejecuta el metodo de negocio getAll
            .then(conn => this.manage(conn, this.campaignModel.getAll(conn)))
            // se atrapa errores y oculta informacion sensible
            .catch(err => {
                console.error(new Date(), err);
                return Promise.reject<ICampaign[]>('Error obteniendo las campañas')
            });
    };

    /**
     * Gets all the active campaigns
     * @returns Promise<ICampaign[]> Returns a Promise of ICampaign[]
     */
    public getActive = async (req: express.Request): Promise<ICampaign[]> => {
        // se verifica el acceso
        return await super.verifyAccessWithPromise(this.getUser(req), this.getTokenId(req), this.getAccountId(req), this.resource)
            // se obtiene la conexion
            .then(dbName => this.getConnectionWithPromise(dbName))
            // se ejecuta el metodo de negocio getActive
            .then(conn => this.manage(conn, this.campaignModel.getActive(conn)))
            // se atrapa errores y oculta informacion sensible
            .catch(err => {
                console.error(new Date(), err);
                return Promise.reject<ICampaign[]>('Error obteniendo las campañas activas')
            });
    };

    /**
     * Activate or deactive a campaign
     * @returns Promise<ICampaign[]> Returns a Promise
     */
    public activateDeactivate = async (req: express.Request): Promise<any> => {
        // se verifica el acceso
        return await super.verifyAccessWithPromise(this.getUser(req), this.getTokenId(req), this.getAccountId(req), this.resource)
            // se obtiene la conexion
            .then(dbName => this.getConnectionWithPromise(dbName))
            // se ejecuta el metodo de negocio activateDeactivate
            .then(conn => this.manage(conn, this.campaignModel.activateDeactivate(req.body.idCampaign, req.body.active, conn)))
            // se atrapa errores y oculta informacion sensible
            .catch(err => {
                console.error(new Date(), err);
                return Promise.reject<any>('Error al activar o desactivar una campaña')
            });
    };
}

import { MainModel, SqlError } from './mainModel';
import { ICampaign } from '../../../datatypes/Campaign';
import { IQueryablePromiseConnection } from '../controllers/mainController';

export class CampaignModel extends MainModel {
    constructor() {
        super();
    }

    /**
     * Gets all the campaigns
     * @param conn: IQueryablePromiseConnection
     * @returns Promise<ICampaign[]> Returns a Promise of ICampaign[]
     */
    public async getAll(conn: IQueryablePromiseConnection): Promise<ICampaign[]> {
        const QUERY: string = 'SELECT * FROM campaign';
        return conn.query(QUERY)
            .catch((reason: SqlError) => this.errorHandlerWithPromise(conn, reason));
    }

    /**
     * Gets all the active campaigns
     * @param conn: IQueryablePromiseConnection
     * @returns Promise<ICampaign[]> Returns a Promise of ICampaign[]
     */
    public async getActive(conn: IQueryablePromiseConnection): Promise<ICampaign[]> {
        const QUERY: string = 'SELECT * FROM campaign WHERE active = true;';
        return conn.query(QUERY)
            .catch((reason: SqlError) => this.errorHandlerWithPromise(conn, reason));
    }

    /**
     * Activate or deactive a campaign
     * @param conn: IQueryablePromiseConnection
     * @returns Promise<ICampaign[]> Returns a Promise
     */
    public async activateDeactivate(idCampaign: number, active: boolean, conn: IQueryablePromiseConnection): Promise<any> {
        const QUERY: string = 'UPDATE campaign SET active = ? WHERE id = ?';
        return conn.query(QUERY, [active, idCampaign])
            .then(result => result && result.affectedRows === 1)
            .catch((reason: SqlError) => this.errorHandlerWithPromise(conn, reason));
    }
}
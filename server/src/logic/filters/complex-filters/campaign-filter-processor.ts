import { BaseFilterProcessor } from "../base-filter-processor";

export class CampaignFilterProcessor extends BaseFilterProcessor {
    createCondition(values: any[], negated: boolean): string {
        const joinRestriction = ` customer_campaign.id IN (  SELECT cc.id
                                                            FROM customer_campaign cc
                                                            INNER JOIN (SELECT idCustomer, MAX(date) AS Maxdate
                                                                        FROM customer_campaign
                                                                        GROUP BY idCustomer) maxCC 
                                                            ON cc.idCustomer = maxCC.idCustomer 
                                                            AND cc.date = maxCC.Maxdate
                                                        ) `;
        const filterQuery = `customer_campaign.idCampaign ${negated ? 'NOT' : ''} IN ( ${values.join(',')} ) `;
        const result = joinRestriction + ' AND ' + filterQuery;
        return result;
    }

    getJoin(): string {
        return BaseFilterProcessor.JOIN_CUSTOMER_CAMPAIGN;
    }
}

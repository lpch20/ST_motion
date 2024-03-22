export interface ICampaign {
    id: number;
    name: string;
    description: string;
    active:boolean;
}

export class Campaign implements ICampaign {
    public id: number;
    public name: string;
    public description: string;
    public active:boolean;

    constructor(id: number, name: string, description: string,active:boolean) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.active = active;
    }
}

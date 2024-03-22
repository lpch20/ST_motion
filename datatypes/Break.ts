export class Break implements IBreak {
    id: number;
    idTypeBreak: number;
    idUser: number;
    date: Date;
    init: boolean;
    serverTime:Date = new Date();

    constructor(id: number, idTypeBreak: number, idUser: number, date: Date, init: boolean) {
        this.id = id;
        this.idTypeBreak = idTypeBreak;
        this.idUser = idUser;
        this.date = date;
        this.init = init;
    }
}

export interface IBreak {
    id: number;
    idTypeBreak: number;
    idUser: number;
    date: Date;
    init: boolean;
    serverTime:Date;
}
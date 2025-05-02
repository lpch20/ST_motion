import { ControllerDBClientsPromiseConnections } from "../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient";

export class ClientPromiseConnectionsBD {
  private host: string = "127.0.0.1";
  private port: number = 3308;
  private user: string = "root";
  private psw: string = "espanhaRoletti30!";
  private controller: ControllerDBClientsPromiseConnections;

  constructor() {
    this.controller = new ControllerDBClientsPromiseConnections(
      this.host,
      this.port,
      this.user,
      this.psw
    );
  }

  public getController(): ControllerDBClientsPromiseConnections {
    return this.controller;
  }
}

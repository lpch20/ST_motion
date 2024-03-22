import { UserController } from '../controllers/usersController';
import * as express from 'express';
import { MainRoute } from './mainRoute';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';

export class UsersRoute extends MainRoute{
    constructor(private masterDBController: ControllerDBMaster,
        private controllerConnections: ControllerDBClientsConnections,
        private controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        private acl: NewACL) {
        super();
    }

    public routes(): express.Router {
        let router: express.Router = express.Router();
        let userController: UserController = new UserController(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl);

        router.get("/", userController.getAll);

        router.post("/", userController.add);

        router.put("/", userController.update);

        router.get("/current", userController.getCurrentUser);

        router.get("/usernames/:username/isAgent", userController.isAgent);

        router.put("/activeDeactivateUser", userController.activeDeactivateUser);

        router.put("/cleanNumberOfAttempts", userController.cleanNumberOfAttempts);

        router.get("/byUserName", userController.getUserByUserName);

        router.get("/getRols", userController.getRols);

        router.get("/getRolCurrentUser", userController.getRolCurrentUser);

        router.get("/getUsers", userController.getUsers);

        router.get('/getLastSessionActivity', userController.getLastSessionActivity);

        router.post("/getSessionsByDate", userController.getSessionsByDate);

        router.post("/getSessionsByCurrentUserByDate", userController.getSessionsByCurrentUserByDate);

        router.post("/validatePasswordCurrentUser", userController.validatePasswordCurrentUser);

        router.post('/updateImage', userController.updateImage)
        return router;
    }
}

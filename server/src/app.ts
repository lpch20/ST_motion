import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from "cookie-parser";
import cors from 'cors';
import express, { Application } from 'express';
import logger from 'morgan';
import * as path from 'path';
import favicon from 'serve-favicon';
import { ClientConnectionsBD } from '../bd/clientConnectionsBD';
import { ClientPromiseConnectionsBD } from '../bd/clientPromiseConnectionsBD';
// db controllers
import { MasterConnectionsBD } from '../bd/masterConnectionsBD';
import { ControllerDBClientsPromiseConnections } from '../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../motionLibJS/serverSide/acl/newACL';
import { ControllerDBClientsConnections } from '../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBMaster } from '../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ActionRoute } from './routes/action';
import { AuthenticateRoute } from './routes/authenticate';
import { BranchOfficeRoute } from './routes/branchOffice';
import { BreaksRoute } from './routes/Breaks';
import { BreakTypeRoute } from './routes/BreakType';
import { CallRoute } from './routes/call';
import { CampaignRoute } from './routes/campaigns';
import { ClientErrorLoggerRoute } from './routes/clientErrorLog';
import { CustomerEventTypeRoute } from './routes/customerEventType';
//routes
import { CustomersRoute } from './routes/customers';
import { DepartamentsRoute } from './routes/departaments';
import { EngagementRoute } from './routes/engagement';
import { EventsRoute } from './routes/events';
import { FiltersRoute } from './routes/filters';
// poc		
import { GetPaidRoute } from './routes/getpaid';
import { ImportCustomerDataRoute } from './routes/importCustomerData';
import { MenuRoute } from './routes/menu';
import { QueueRoute } from './routes/queue';
import { ReportsRoute } from './routes/reports';
import { ScheduleRoute } from './routes/schedule';
import { SmsRoute } from './routes/sms';
import { UsersRoute } from './routes/users';
import { ParametersRoute } from './routes/parameters';


//require('console-ten').init(console);

export class App {
	protected masterDBController: ControllerDBMaster;
	protected acl: NewACL;

	// client connection
	protected controllerConnections: ControllerDBClientsConnections;

	// promise client connection
	protected controllerPromiseConnections: ControllerDBClientsPromiseConnections;

	constructor(private port: number) {

		this.acl = new NewACL();
		// master
		const masterConnectionsBD = new MasterConnectionsBD();
		this.masterDBController = masterConnectionsBD.getController();
		// client connection
		const clientConnection: ClientConnectionsBD = new ClientConnectionsBD();
		this.controllerConnections = clientConnection.getController();
		// promise client connection
		const clientPromiseConnection: ClientPromiseConnectionsBD = new ClientPromiseConnectionsBD();
		this.controllerPromiseConnections = clientPromiseConnection.getController();
	}

	public init(): Application {
		this.acl.setUp(this.masterDBController.getMasterConnection().getConnection());
		var app = express();
		app.use(compression());

		const corsOptions = {
			origin: 'http://localhost:4200',
			credentials: true,

		}
		app.use(cors(corsOptions));

		app.set('port', this.port);

		// view engine setup
		app.set('views', path.join(__dirname, '..', 'views'));
		app.set('view engine', 'jade');

		app.use(express.static('../client/dist'));
		app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
		app.use(express.static(path.join(__dirname, '..', 'public')));
		app.use(express.static('./images'));

		// uncomment after placing your favicon in /public
		app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')));

		// app.use(logger('dev'));

		logger.format('myformat', '[:date[iso]] ":method :url" :status :res[content-length] - :response-time ms');
		app.use(logger('myformat'));

		app.use(bodyParser.json({ limit: '3mb' }));
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use(cookieParser());

		app.use('/api/authenticate', new AuthenticateRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
		app.use('/api/users', new UsersRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
		app.use('/api/customers', new CustomersRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
		app.use('/api/breakType', new BreakTypeRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
		app.use('/api/breaks', new BreaksRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
		app.use('/api/customerEventType', new CustomerEventTypeRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
		app.use('/api/schedule', new ScheduleRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
		app.use('/api/call', new CallRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
		app.use('/api/campaigns', new CampaignRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
		app.use('/api/engagement', new EngagementRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
		app.use('/api/departaments', new DepartamentsRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
		app.use('/api/importData', new ImportCustomerDataRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
		app.use('/api/menu', new MenuRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
		app.use('/api/events', new EventsRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
		app.use('/api/filters', new FiltersRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
		app.use('/api/reports', new ReportsRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
		app.use('/api/queue', new QueueRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
		app.use('/api/sms', new SmsRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
		app.use('/api/branchOffice', new BranchOfficeRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
		app.use('/api/action', new ActionRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
		app.use('/api/clientErrorLog', new ClientErrorLoggerRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes())
		app.use('/api/parameters', new ParametersRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
		
		// poc
		app.use('/api/getpaid', new GetPaidRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());

		// catch 404 and forward to error handler
		app.use(function (req, res, next) {
			var err = new Error('Not Found');
			(<any>err).status = 404;
			next(err);
		});

		// error handlers
		// development error handler
		// will print stacktrace
		if (app.get('env') === 'development') {
			app.use(function (err: any, req: any, res: any, next: any) {
				res.status(err.status || 500);
				res.render('error', {
					message: err.message,
					error: err
				});
			});
		}

		// production error handler
		// no stacktraces leaked to user
		app.use(function (err: any, req: any, res: any, next: any) {
			res.status(err.status || 500);
			res.render('error', {
				message: err.message,
				error: {}
			});
		});

		return app;
	}
}

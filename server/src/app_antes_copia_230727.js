"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var body_parser_1 = __importDefault(require("body-parser"));
var compression_1 = __importDefault(require("compression"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var path = __importStar(require("path"));
var serve_favicon_1 = __importDefault(require("serve-favicon"));
var clientConnectionsBD_1 = require("../bd/clientConnectionsBD");
var clientPromiseConnectionsBD_1 = require("../bd/clientPromiseConnectionsBD");
// db controllers
var masterConnectionsBD_1 = require("../bd/masterConnectionsBD");
var newACL_1 = require("../motionLibJS/serverSide/acl/newACL");
var action_1 = require("./routes/action");
var authenticate_1 = require("./routes/authenticate");
var branchOffice_1 = require("./routes/branchOffice");
var Breaks_1 = require("./routes/Breaks");
var BreakType_1 = require("./routes/BreakType");
var call_1 = require("./routes/call");
var campaigns_1 = require("./routes/campaigns");
var clientErrorLog_1 = require("./routes/clientErrorLog");
var customerEventType_1 = require("./routes/customerEventType");
//routes
var customers_1 = require("./routes/customers");
var departaments_1 = require("./routes/departaments");
var engagement_1 = require("./routes/engagement");
var events_1 = require("./routes/events");
var filters_1 = require("./routes/filters");
// poc		
var getpaid_1 = require("./routes/getpaid");
var importCustomerData_1 = require("./routes/importCustomerData");
var menu_1 = require("./routes/menu");
var queue_1 = require("./routes/queue");
var reports_1 = require("./routes/reports");
var schedule_1 = require("./routes/schedule");
var sms_1 = require("./routes/sms");
var users_1 = require("./routes/users");
//require('console-ten').init(console);
var App = /** @class */ (function () {
    function App(port) {
        this.port = port;
        this.acl = new newACL_1.NewACL();
        // master
        var masterConnectionsBD = new masterConnectionsBD_1.MasterConnectionsBD();
        this.masterDBController = masterConnectionsBD.getController();
        // client connection
        var clientConnection = new clientConnectionsBD_1.ClientConnectionsBD();
        this.controllerConnections = clientConnection.getController();
        // promise client connection
        var clientPromiseConnection = new clientPromiseConnectionsBD_1.ClientPromiseConnectionsBD();
        this.controllerPromiseConnections = clientPromiseConnection.getController();
    }
    App.prototype.init = function () {
        this.acl.setUp(this.masterDBController.getMasterConnection().getConnection());
        var app = express_1.default();
        app.use(compression_1.default());
        var corsOptions = {
            origin: 'http://localhost:4200',
            credentials: true,
        };
        app.use(cors_1.default(corsOptions));
        app.set('port', this.port);
        // view engine setup
        app.set('views', path.join(__dirname, '..', 'views'));
        app.set('view engine', 'jade');
        app.use(express_1.default.static('../client/dist'));
        app.use(express_1.default.static(path.join(__dirname, '..', 'client', 'dist')));
        app.use(express_1.default.static(path.join(__dirname, '..', 'public')));
        app.use(express_1.default.static('./images'));
        // uncomment after placing your favicon in /public
        app.use(serve_favicon_1.default(path.join(__dirname, '..', 'public', 'favicon.ico')));
        // app.use(logger('dev'));
        morgan_1.default.format('myformat', '[:date[iso]] ":method :url" :status :res[content-length] - :response-time ms');
        app.use(morgan_1.default('myformat'));
        app.use(body_parser_1.default.json({ limit: '3mb' }));
        app.use(body_parser_1.default.urlencoded({ extended: false }));
        app.use(cookie_parser_1.default());
        app.use('/api/authenticate', new authenticate_1.AuthenticateRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
        app.use('/api/users', new users_1.UsersRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
        app.use('/api/customers', new customers_1.CustomersRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
        app.use('/api/breakType', new BreakType_1.BreakTypeRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
        app.use('/api/breaks', new Breaks_1.BreaksRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
        app.use('/api/customerEventType', new customerEventType_1.CustomerEventTypeRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
        app.use('/api/schedule', new schedule_1.ScheduleRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
        app.use('/api/call', new call_1.CallRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
        app.use('/api/campaigns', new campaigns_1.CampaignRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
        app.use('/api/engagement', new engagement_1.EngagementRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
        app.use('/api/departaments', new departaments_1.DepartamentsRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
        app.use('/api/importData', new importCustomerData_1.ImportCustomerDataRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
        app.use('/api/menu', new menu_1.MenuRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
        app.use('/api/events', new events_1.EventsRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
        app.use('/api/filters', new filters_1.FiltersRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
        app.use('/api/reports', new reports_1.ReportsRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
        app.use('/api/queue', new queue_1.QueueRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
        app.use('/api/sms', new sms_1.SmsRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
        app.use('/api/branchOffice', new branchOffice_1.BranchOfficeRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
        app.use('/api/action', new action_1.ActionRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
        app.use('/api/clientErrorLog', new clientErrorLog_1.ClientErrorLoggerRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
        // poc
        app.use('/api/getpaid', new getpaid_1.GetPaidRoute(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl).routes());
        // catch 404 and forward to error handler
        app.use(function (req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });
        // error handlers
        // development error handler
        // will print stacktrace
        if (app.get('env') === 'development') {
            app.use(function (err, req, res, next) {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
        }
        // production error handler
        // no stacktraces leaked to user
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });
        return app;
    };
    return App;
}());
exports.App = App;
//# sourceMappingURL=app.js.map
import express, { Application, Router } from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import Keycloak from 'keycloak-connect';
import cors from 'cors';
// import { DataSource   } from "typeorm";
import dataSource from "./dataSource";


// import pool from './dbconfig/dbconnector';
import FileDirectoryCheck from './helper/fileDirectory';

import indexRouter from './routers/indexRouter';
import uploadRouter from './routers/uploadRouter';

import logger from './middleware/logger';

const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({
                                store: memoryStore
                            });

class Server {
    private app;
    private port;
    private fileUploadDirectoryPath;
    private keycloakAdminUrl;
    private keycloakLogoutUrl;

    constructor(port: string, 
                fileUploadDirectoryPath: string,
                keycloakAdminUrl: string,
                keycloakLogoutUrl: string) {
        this.app = express();
        this.port = port;
        this.fileUploadDirectoryPath = fileUploadDirectoryPath;
        this.keycloakAdminUrl = keycloakAdminUrl;
        this.keycloakLogoutUrl = keycloakLogoutUrl;

        this.sessionManage();
        this.middleware();
        this.config();
        this.routerConfig();
        this.fileDirectoryCheck();
        this.dbConnect();
        
    }

    private config() {
        this.app.use(bodyParser.urlencoded({ limit: '100mb',
                                            parameterLimit: 100000,
                                            extended: false  }));
        this.app.use(bodyParser.json({ limit: '100mb' })); // Request Size Setting
        this.app.use(cors({
                            origin: true,
                            methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
                            credentials: true,
                        }));
    }

    private fileDirectoryCheck() {
        FileDirectoryCheck(this.fileUploadDirectoryPath);
    }

    private dbConnect() {
        dataSource.initialize()
            .then(() => {
                // here you can start to work with your database
            })
            .catch((error) => console.log(error))
        // pool.connect(function (err: any, client, done) {
        //     if (err) throw new Error(err);
        //     console.log('DB Connected');
        //   }); 
    }

    private routerConfig() {
        this.app.use('/', indexRouter);
        this.app.use('/upload', keycloak.protect('realm:myc'), uploadRouter);
    }

    private middleware() {
        this.app.use(logger);
        this.app.use(keycloak.middleware({
            logout: this.keycloakLogoutUrl,
            admin: this.keycloakAdminUrl
        }));
    }

    private sessionManage() {
        this.app.use(session({
            secret: 'myc-session',
            resave: false,
            saveUninitialized: true,
            store: memoryStore
        }));
    }
    // private assets() {
    //     this.app.use(express.static('public'));
    //     this.app.use(express.static('views'));
    // }

    // private template() {
    //     this.app.set('view engine', 'ejs');
    // }

    public start = (port: number) => {
        return new Promise((resolve, reject) => {
            this.app.listen(port, () => {
                resolve(port);
            }).on('error', (err: Object) => reject(err));
        });
    }
}

export default Server;
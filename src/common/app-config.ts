import "reflect-metadata";
import {ConnectionOptions} from "typeorm";

 export let dbOptions: ConnectionOptions = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "appdatabase",
    entities: [
         "./entities/*.js"
    ],
    synchronize: true,
}


/*
import "reflect-metadata";
import {ConnectionOptions} from "typeorm";
 
 export let dbOptions: ConnectionOptions = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "instruments",
    password: "instruments",
    database: "instruments",
    entities: [
         "./entities/*.js"
    ],
    synchronize: true,
}*/

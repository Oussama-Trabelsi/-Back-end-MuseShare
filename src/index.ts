import * as express from 'express';
import * as bodyParser from "body-parser";
import "reflect-metadata";
import {createConnection} from "typeorm";
import * as appConfig from "./common/app-config";
import routes from "./routes";



var multer = require('multer');
var upload_image = multer({dest:'uploads/profile_images'});
var upload_track = multer({dest:'uploads/tracks'});



/**
 * Create Express server.
 */
const app = express();

app.use(express.static('public'));

//Serves all the request which includes /images in the url from Images folder
app.use('/profile_images', express.static(__dirname + '/uploads/profile_images'));
app.use('/tracks', express.static(__dirname + '/uploads/tracks'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/user/upload_image', upload_image.single('profile_image'), (req, res) => {
  try {
    res.send(req.file);
  }catch(err) {
    res.send(400);
  }
});

app.post('/post/upload', upload_track.single('file'), (req, res) => {
  try {
    res.send(req.file);
  }catch(err) {
    res.send(400);
  }
});

/**
 * Express configuration.
 */
app.set("port", process.env.PORT || 3000);

/**
 * Start Express server.
 */
app.listen(app.get("port"), () => {
  console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
  console.log("  Press CTRL-C to stop\n");
});

//Set all routes from routes folder
app.use("/", routes);

/**
 * Create connection to DB using configuration provided in 
 * appconfig file.
 */
createConnection(appConfig.dbOptions).then(async connection => {
    console.log("Connected to DB");

}).catch(error => console.log("TypeORM connection error: ", error));

module.exports = app;
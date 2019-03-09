let util = require("util");
let express = require("express");
let bodyParser = require("body-parser");
let yaml = require("js-yaml");
let fs = require("fs");
let _ = require("underscore");
let low = require("lowdb");
let FileSync = require("lowdb/adapters/FileSync");
let adapter = new FileSync("db.json");
let db = low(adapter);
let Logger = require("./logger")
let DBHelper = require("./dbhelper");
let MethodHelper = require("./methodhelper");
let path = require("path");
let app = express();
app.use(bodyParser.json());
app.use("/public", express.static('public'))

const METHOD_POST = "post";
const METHOD_PUT = "put";
const METHOD_GET = "get";
const METHOD_DELETE = "delete"


const data = yaml.load(fs.readFileSync("setup.yaml"));


let setupDatabase = () => {
    Logger.log("Building Database Structure");
    let dbObject = { };
     
    for (let model in data.models)
        dbObject[model] = [];

    db.defaults(dbObject).write();
}


const sendFailRequest = (res, msg) => {
    res.status(400)
    .json({
        success: false, 
        message: msg
    })
}

//CREATE DATABASE BASED ON OUR MODELS
setupDatabase();


//CREATE THE ENDPOINT
Logger.log("Building Endpoints");
for (let endpoint in data.endpoints) {
    Logger.log('Building Endpoing: [%s]',  endpoint);
    
    let methods = data.endpoints[endpoint];
    for (let method in methods) {
        Logger.log('-- Method: %s', method.toUpperCase());
    
        let model = methods[method].model;
        let dbHelper = new DBHelper(db, model.name);
        let methodHelper = new MethodHelper(methods[method]);

        if (method == METHOD_PUT){
            app.put(endpoint, (req,res) => {
                try {
                    const queryFind = methodHelper.getParamsAsJSON(req);
                    const queryUpdate = methodHelper.getPutDataAsJSON(req);
                    const record = dbHelper.getRecord(queryFind);
                    const modifiedData = Object.assign({}, record, queryUpdate);
    
                    dbHelper.update(queryFind, modifiedData);
                    res.send({success:true});
                }
                catch (e) {
                    sendFailRequest(res, e.message);
                    return;
                }
            });
        }
        if (method == METHOD_DELETE){
            app.delete(endpoint, (req,res) => {
                try {
                    const query= methodHelper.getParamsAsJSON(req);
                    dbHelper.delete(query);
                    res.json({success:true});
                }
                catch (e) {
                    sendFailRequest(res, e.message);
                    return;
                }
            });
        }
        if (method == METHOD_POST){
            app.post(endpoint, (req,res) => {
                try {
                    console.log("....1")
                    const postData = methodHelper.getPostedDataAsJSON(req);
                    console.log("....2")
                    dbHelper.add(postData);
                    res.json({success:true});
                }
                catch (e) {
                    sendFailRequest(res, e.message);
                    return;
                }    
            });
        }
        if (method== METHOD_GET)
        {
            if (methodHelper.hasParameters())
            {
                //get data by id
                app.get(endpoint, (req,res) => {
                    try {
                        const query= methodHelper.getParamsAsJSON(req);
                        const data = dbHelper.getRecord(query);

                        if (data == undefined) {
                            sendFailRequest(res,"No Data Available");
                            return;
                        }
                        res.json(data);            
                    }
                    catch(e){
                        sendFailRequest(res, e.message);
                        return;
                    }
                });
            }
            else {
                //get all data
                app.get(endpoint, (req,res) => {
                    try {
                        res.json(dbHelper.getAll());        
                    }
                    catch (e){
                        sendFailRequest(res, e.message);
                        return;
                    }
                });
            }
        }
    }
}
app.get("/config", function(req,res){
    var result = {
        server: {
            port: data.setup.port,
            host: data.setup.host
        },
        endpoints:[]
    }
    for (let endpoint in data.endpoints)
    {
        const methods = data.endpoints[endpoint];
        for (let method in methods)
        {
            let methodItem = methods[method];
            let schema = methodItem.model.schema;
            let objEndpoint = {}
            objEndpoint.url = endpoint;
            objEndpoint.method = method;
            objEndpoint.params = [];
            objEndpoint.columns = [];
            objEndpoint.body = "";
            objEndpoint.description = methodItem.description;
            if (methodItem.params)
            {
                methodItem.params.forEach(function(param){
                    let objParam = {};
                    objParam.name = param.name;
                    objParam.type = param.type;
                    objEndpoint.params.push(objParam);

                })
            }
            for (let column in schema){
                var objColumn = {};
                objColumn.name = column;
                objColumn.type = schema[column].type;
                objEndpoint.columns.push(objColumn);
            }
            var jsonBody = {}
            for (let column in schema){
                jsonBody[column] = "";
            }
            objEndpoint.body = JSON.stringify(jsonBody, null, 4);
        result.endpoints.push(objEndpoint);
        }
    }
    res.json(result);
})

app.get("/api", function(req,res){
    res.sendFile(path.join(__dirname,"/views/base.html"));
})

app.listen(data.setup.port,data.setup.host, () => {
    console.log(util.format("Server running on %s:%s", data.setup.host, data.setup.port));
})
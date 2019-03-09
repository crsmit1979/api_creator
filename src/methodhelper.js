const PARAM_INT = "int";


class MethodHelper {
    constructor(method, req) {
        this.method = method;
        this.params = method.params;
        this.model = method.model;
    }

    convertParamValue(paramType, value) {
        if (paramType == PARAM_INT) return parseInt(value);
        else return value;
    }

    hasParameters() {
        if (this.params == undefined) return false;
        if(this.params.length > 0)    return true;
        return false;
    }

    getParamsAsJSON(req) {
        let obj = {};
        this.params.forEach((param) => {
            obj[param.name] = this.convertParamValue(param.type, req.params[param.name]);
        });
        return obj;
    }
    getPostedDataAsJSON(req) {
        let obj = {};
        console.log(this.model);
        for (let col in this.model.schema)
            obj[col] = req.body[col];

        return obj;
    }

    getPutDataAsJSON(req) {
        let obj = {};
        for (let col in this.model.schema){
            if (req.body[col] != undefined)
                obj[col] = req.body[col];
        }
        return obj;
    }
}


module.exports = MethodHelper
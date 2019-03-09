class DBHelper {
    constructor(db, modelName) {
        this.db = db;
        this.modelName = modelName;
    }
    getAll() {
        return this.db
        .get(this.modelName);
    }
    getRecord(findQuery){
        return this.db
        .get(this.modelName)
        .find(findQuery)
        .value();

    }
    update(findQuery, updateQuery) {
        return this.db
        .get(this.modelName)
        .find(findQuery)
        .assign(updateQuery)
        .write();
    }
    delete(query) {
        this.db
        .get(this.modelName)
        .remove(query)
        .write();
    }
    add(query){
        this.db
        .get(this.modelName)
        .push(query)
        .write();
    }
}

module.exports = DBHelper;
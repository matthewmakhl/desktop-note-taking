const jsonfile = require('jsonfile')
const path = require('path');

module.exports = class JsonFile {
    constructor(fileName){
        this.fileName = fileName;
    }

    write(transformer) {
        return new Promise((resolve, reject) => {
            jsonfile.readFile(path.join(__dirname, '../storage', this.fileName), (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    let result = transformer(data);
                    jsonfile.writeFile(path.join(__dirname, '../storage', this.fileName), result.data, {spaces: 2},  (err) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve([result.id]);
                        }
                    });
                }
            });
        })
    }

    read(transformer) {
        return new Promise((resolve, reject) => {
            jsonfile.readFile(path.join(__dirname, '../storage', this.fileName), (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(transformer(data));
                }
            });
        });
    }
}
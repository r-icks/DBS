import sqlite from 'sqlite3';

const DBSOURCE = './db/sample.db';
let db;

const init = () => {
    return new Promise((resolve, reject) => {
        db = new sqlite.Database(DBSOURCE, (err) => {
            if (err) {
                reject(err);
            } else {
                console.log('Connected to the SQLite database.');
                resolve();
            }
        });
    });
};

const all = (query, params) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const get = (query, params) => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

const runSequentialOperations = (operations) => {
    return new Promise((resolve, reject) => {
        if (!operations || operations.length === 0) {
            resolve();
            return;
        }

        const executeOperation = (index) => {
            if (index === operations.length) {
                resolve();
                return;
            }

            const operation = operations[index];
            db.run(operation.query, operation.params, function (err) {
                if (err) {
                    reject(err);
                    return;
                }

                executeOperation(index + 1);
            });
        };

        executeOperation(0);
    });
};

const serialize = (operations) => {
    return runSequentialOperations(operations);
};

const run = (query, params) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({ lastID: this.lastID, changes: this.changes });
            }
        });
    });
};

export default {
    init,
    all,
    get,
    serialize,
    run
};

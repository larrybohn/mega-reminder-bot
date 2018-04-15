import childProcess from 'child_process'
import bluebird from 'bluebird';
import fs from 'fs';
bluebird.promisifyAll(childProcess);

const url = process.argv[2]

const designDocuments = [
    {
        file: 'src/model/_design/reminders.js',
        db: 'reminders'
    },
    {
        file: 'src/model/_design/auth-tokens.js',
        db: 'auth-tokens'
    }
];

bluebird.all(designDocuments.map(d => {
    let deployCmd = `node ./couchmigrate/app.js --dd ${d.file} --db ${d.db}`;
    if (url) {
        deployCmd += ` --url ${url}`;
    }
    console.log(deployCmd);
    childProcess.execAsync(deployCmd, (error, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
    });
}));
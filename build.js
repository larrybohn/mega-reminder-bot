import childProcess from 'child_process'
import bluebird from 'bluebird';
import fs from 'fs';
bluebird.promisifyAll(childProcess);

const environment = process.argv[2] || 'development';
const configPath = `config/config.${environment}.json`;
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

async function compileAsync() {
    let babelCmd = 'babel src -d build --ignore src/web/public,src/model/_design';
    if (config.debug) {
        babelCmd += ' --source-maps';
    }
    try {
        await childProcess.execAsync(babelCmd, (error, stdout, stderr) => {
            console.log(stderr);
        });
    }catch(e) {
        console.log(e);
    }
}

async function webpackAsync() {
    let webpackCmd = `npx webpack --config webpack.${environment}.js`;
    try {
        await childProcess.execAsync(webpackCmd, (error, stdout, stderr) => {
            console.log(stdout);
        });
    }catch(e){
        console.log(e);
    }
}
fs.copyFileSync(configPath, './build/config.json');

compileAsync();
if (!config.debug) {
    webpackAsync(); //in debug mode, webpack compilation is performed in the server to support hot reloading
}
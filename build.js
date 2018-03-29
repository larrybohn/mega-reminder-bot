import childProcess from 'child_process'
import bluebird from 'bluebird';
import fs from 'fs';
bluebird.promisifyAll(childProcess);

const environment = process.argv[2] || 'development';
const configPath = `config/config.${environment}.json`;
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

//console.log(config);
async function compileAsync() {
    let babelCmd = 'babel src -d build --ignore src/web/public,src/model/_design';
    if (config.debug) {
        babelCmd += ' --source-maps';
    }
    await childProcess.execAsync(babelCmd);
}

async function webpackAsync() {
    let webpackCmd = `npx webpack --config webpack.${environment}.js`;
    await childProcess.execAsync(webpackCmd);
}
fs.copyFileSync(configPath, './build/config.json');

compileAsync();
webpackAsync();
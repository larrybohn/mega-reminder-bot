# Setup instructions
1. Clone this repository
2. Install submodules (```git submodule update --init```)
3. Install CouchDB 2.1.1 from http://couchdb.apache.org/#download
4. Run ```npm install```
5. Run ```npm run deploy-database http://localhost:5984``` to deploy database schema to your local CouchDB instance
6. Obtain your own bot token from https://t.me/botfather
7. Set BOT_TOKEN environment variable to the token obtained at step 5
8. Set COUCH_DB_CONNECTION_STRING environment variable to the connection string to your CouchDB instance or skip this to use ```http://localhost:5984``` by default
9.1 Run ```npm run debug-web``` to start the website at http://localhost:3200
9.2 Run ```npm run debug-bgservice``` to start the background service

Production version is available at http://t.me/megareminderbot / https://megareminderbot.herokuapp.com/

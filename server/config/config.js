const environment = 'development';

const defaultPort = 3000; 

const config = {
    development: {
        port: defaultPort,
        dbUrl: 'mongodb://localhost:27017/React-Project',
        origin: ['http://localhost:5555', 'http://localhost:5173']
    },
    production: {
        port: defaultPort,
        // dbUrl: 'mongodb://production_database_url_here',
        origin: [],
    }
};

module.exports = config[environment];
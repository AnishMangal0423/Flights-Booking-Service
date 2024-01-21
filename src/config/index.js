const dotenv= require('dotenv');

dotenv.config();

module.exports={

    Server_config:require('./Server-config'),
    Queue:require('./queue-config')
}
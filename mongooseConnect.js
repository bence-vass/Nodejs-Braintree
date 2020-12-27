const mongoose = require('mongoose');

if(process.env.NODE_ENV === 'test'){
    require('dotenv').config({path: '.env.test'})
}
if(process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'dev'){
    require('dotenv').config({path: '.env.development'})
}

//mongoose.Promise = global.Promise;
const uri =
    'mongodb+srv://' +
    process.env.MONGO_ATLAS_USER +
    ':' +
    process.env.MONGO_ATLAS_PW +
    '@cluster0.mboj5.mongodb.net/' +
    process.env.MONGO_ATLAS_CLUSTER +
    '?retryWrites=true&w=majority'

mongoose.connect(uri ,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
)

module.exports = mongoose
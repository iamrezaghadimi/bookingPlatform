module.exports = () => {
    let databaseName = process.env.MONGO_DATABASE
    if(process.env.NODE_ENV === 'test') databaseName = `${databaseName}_test`

    let uri;
    if(process.env.MONGO_PASSWORD){
        uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${databaseName}?authSource=admin`;
    }
    else{
        uri = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${databaseName}`
    }

    return uri;

}
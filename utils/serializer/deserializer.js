const Serializer = require('./index')

class ModelDeserializer extends Serializer {

    async findByID(docID){
        try{
            console.log(docID)
            let doc = await this.model.findById(docID)
            this.res.status(500).json(doc)
        } catch (e) {
            this.res.status(500).json({error: e})
        }
    }

}

module.exports = ModelDeserializer
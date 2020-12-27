const Serializer = require('./index')

class ModelDeserializer extends Serializer {

    async findByID(docID){
        try{
            let doc = await this.model.findById(docID)
            this.res.status(200).json(doc)
        } catch (e) {
            this.res.status(500).json({error: e})
        }
    }

    async listCollection(){
        try{
            let docs = await this.model.find({})
            this.res.status(200).json(docs)
        } catch (e) {
            this.res.status(500).json({error: e})
        }
    }

}

module.exports = ModelDeserializer
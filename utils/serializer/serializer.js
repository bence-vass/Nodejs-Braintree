const Serialzier = require('./index')

class ModelSerializer extends Serialzier {
    async create(){
        try{
            let body = this.req.body
            //console.log(body)
            let doc = new this.model(body)
            //console.log(doc)
            await doc.save()
            this.res.status(200).json(doc)
        } catch (e) {
            this.res.status(500).json({error: e})
        }
    }

    async delete(docID){
        try{
            let doc = await this.model.findById(docID)
            await doc.remove()
            this.res.status(200).json(doc)
        } catch (e) {
            this.res.status(500).json({error: e})
        }
    }

    async updateByID(docID, newData){
        try{
            console.log(docID)
            let doc = await this.model.findById(docID)
            console.log(newData)
            let validFieldKeys = Object.keys(this.model.schema.tree)
            Object.entries(newData).forEach(([key, value], index) => {
                if(validFieldKeys.includes(key)){
                    doc[key] = value
                } else {
                    throw 'Invalid field'
                }
            })
            await doc.save()
            this.res.status(200).json(doc)
        } catch (e) {
            this.res.status(500).json({error: e})
        }
    }
}

module.exports = ModelSerializer
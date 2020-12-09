class DeserializeModel{
    constructor(mongooseModel) {
        this.model = mongooseModel
        this.res = null
        this.req = null
        this.next = null
    }
    async init(req, res, next){
        this.req = req
        this.res = res
        this.next = next
    }

    async create(){
        try{
            let body = this.req.body
            let doc = new this.model(body)
            await doc.save()
            this.res.status(200).json(doc)
        } catch (e) {
            this.res.status(500).json({error: e})
        }
    }

    async delete(docID){
        try{
            console.log(docID)
            let doc = await this.model.findById(docID)
            await doc.remove()
            console.log(doc)
            this.res.status(200).json(doc)
        } catch (e) {
            this.res.status(500).json({error: e})
        }
    }

    async findByID(docID){
        try{
            console.log(docID)
            let doc = await this.model.findById(docID)
            this.res.status(500).json(doc)
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

module.exports = DeserializeModel
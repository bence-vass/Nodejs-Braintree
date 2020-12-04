class DeserializeModel{
    constructor(mongooseModel) {
        this.model = mongooseModel
        this.res = null
        this.req = null
        this.next = null
    }
    async init(req, res, next){
        this.res = res
        this.req = req
        this.next = next
    }

    async create(){
        try{
            let body = this.req.body
            let newDoc = new this.model(body)
            await newDoc.save()
            this.res.status(200).json(newDoc)
        } catch (e) {
            this.res.status(500).json({error: e})
        }
    }
}

module.exports = DeserializeModel
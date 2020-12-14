class Serializer {
    constructor(mongooseModel, req, res, next) {
        this.model = mongooseModel
        this.res = res || null
        this.req = req || null
        this.next = next || null
    }
    async init(req, res, next){
        this.req = req
        this.res = res
        this.next = next || null
    }
}

module.exports = Serializer
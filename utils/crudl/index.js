const {ArrayElementsElementsOfArray: checkArrayOfFn} = require('../../validators/arrays/ArrayIncludes')
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const ModelDeserializer = require('../serializer/deserializer')
const ModelSerializer = require('../serializer/serializer')

const REQUEST_FUNCTIONS = ["CREATE", "READ", "UPDATE", "DELETE", "LIST"]

class CRUDL {
    constructor(dbModel, router, urlString, options = {functionsIncluded: REQUEST_FUNCTIONS, functionsExcluded: null}) {
        this.dbModel = dbModel
        this.router = router
        this.urlString = urlString
        this.enabledFunction = CRUDL.setEnabledFunctions(options.functionsIncluded, options.functionsExcluded)
    }
    static allAvailableFunction = REQUEST_FUNCTIONS
    static setEnabledFunctions = (included, excluded) => {
        if (included === null && excluded === null) {
            throw new Error('Give at least one valid parameter')
        }
        if (included && excluded) {
            throw new Error('Include and exclude can not be parameters at the sametime')
        }
        if (excluded) {
            if (checkArrayOfFn(excluded, CRUDL.allAvailableFunction)) {
                return excluded
            } else {
                throw new Error('Invalid exclude functions')
            }
        }
        if (included) {
            if (checkArrayOfFn(included, CRUDL.allAvailableFunction)) {
                return included
            } else {
                throw new Error('Invalid include functions')
            }
        }


    }

    createView(){
        return this.router.post(this.urlString+'/create', async (req, res, next) => {
            let serializer = new ModelSerializer(this.dbModel)
            await serializer.init(req, res, next)
            await serializer.create()
        })
    }

    readView(){
        return this.router.post(this.urlString+'/:documentID', async (req, res, next) => {

        })
    }

    updateView(){
        return this.router.post(this.urlString+'/:documentID/update', async (req, res, next) => {
            const docID = req.params.documentId || null
            const newData = req.body || null
            let serializer = new ModelSerializer(this.dbModel)
            await serializer.init(req, res, next)
            await serializer.updateByID(docID, newData)
        })
    }
    deleteView(){
        return this.router.post(this.urlString+'/:documentID/delete', async (req, res, next) => {
            const docID = req.params.documentId || null
            let serializer = new ModelSerializer(this.dbModel)
            await serializer.init(req, res, next)
            await serializer.delete(docID)
        })
    }
    listView(){
        return this.router.post(this.urlString+'/list', async (req, res, next) => {

        })
    }

}

module.exports = CRUDL
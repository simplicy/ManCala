import Log from '../../lib/models/log.model'
const createAccount = async(req,res) => {
    var newId = Math.floor(Math.random()*9000000) + 1000000;
    while((await Log.find({id:newId})).length!=0){
        newId = Math.floor(Math.random()*9000000) + 1000000;
    }
    const payload = JSON.parse(req.body.payload);
    console.log(JSON.parse(req.body.payload))
    var log = new Log({
        id: newId,
        who: req.body.user,
        type:"ADD",
        group:payload.group.toString(),
        data:JSON.parse(payload.data),
    })
    console.log(log)
    log.save(log, (error,data)=>{
        if(error){
            res.status(500).send({
                success:false,
                message:
                error.message || "Some error occurred while creating the log."
            });
            logCount--;
        }
        if(data)
            res.status(200).send({
                success: true,
                data: data,
            })
    })
    
} 

const findAllAccounts = async(req,res) => {
    var condition = {};
    try {
        Log.find(condition,(error,data) => {
            res.status(200).send({
                success: true,
                data: data,
            })
        })
    }  catch (error) {
        res.status(500).send({
            success:false,
            message:
              error.message || "Some error occurred while retrieving products."
          });
    }
}

const updateAccount = async(req,res) => {
    var newId = Math.floor(Math.random()*9000000) + 1000000;
    while((await Log.find({id:newId})).length!=0){
        newId = Math.floor(Math.random()*9000000) + 1000000;
    }
    const payload = JSON.parse(req.body.payload);
    console.log(JSON.parse(req.body.payload))
    var log = new Log({
        id: newId,
        who: req.body.user,
        type:"UPDATE",
        group:payload.group.toString(),
        data:JSON.parse(payload.data),
    })
    console.log(log)
    log.save(log, (error,data)=>{
        if(error){
            res.status(500).send({
                success:false,
                message:
                error.message || "Some error occurred while creating the log."
            });
            logCount--;
        }
        if(data)
            res.status(200).send({
                success: true,
                data: data,
            })
    })
 }

 
const deleteAccount = async(req,res) => {
    var newId = Math.floor(Math.random()*9000000) + 1000000;
    while((await Log.find({id:newId})).length!=0){
        newId = Math.floor(Math.random()*9000000) + 1000000;
    }
    const payload = JSON.parse(req.body.payload);
    console.log(JSON.parse(req.body.payload))
    var log = new Log({
        id: newId,
        who: req.body.user,
        type:"DELETE",
        group:payload.group.toString(),
        data:JSON.parse(payload.data),
    })
    console.log(log)
    log.save(log, (error,data)=>{
        if(error){
            res.status(500).send({
                success:false,
                message:
                error.message || "Some error occurred while creating the log."
            });
            logCount--;
        }
        if(data)
            res.status(200).send({
                success: true,
                data: data,
            })
    })
    
} 

const methods = {
    GET: findAllAccounts,
    POST: createAccount,
    PUT: updateAccount,
    DELETE: deleteAccount,
}



export default async function handler(req, res) {
    const { method } = req
    
    const methodHandler = methods[method]


    if (!methodHandler) {
        res.status(400).json({
            success: false,
            message: 'Method not found'
        })
    }

    await methodHandler(req, res)
    
}

export const config = {
    api:{
        externalResolver: true,
    },
}


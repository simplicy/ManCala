import Log from '../../lib/models/log.model'

const createAccount = async(req,res) => {
    var log = new Log({
        type:"ADD",
        group:req.body.group,
        data:JSON.parse(req.body.data),
    })
    log.save(log, (error,data)=>{
        if(error)
            res.status(500).send({
                success:false,
                message:
                error.message || "Some error occurred while creating the log."
            });
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
    var log = new Log({
        type: req.body.type,
        data: {
            oldEvent: {
                accountID:req.body.data.oldEvent.accountID,
                friendlyName:req.body.data.oldEvent.friendlyName,
                calendarID:req.body.data.oldEvent.calendarID,
            },
            newEvent: {
                accountID:req.body.data.newEvent.accountID,
                friendlyName:req.body.data.newEvent.friendlyName,
                calendarID:req.body.data.newEvent.calendarID,
            },
            }
        });
    const filter = { accountID: req.body.data.oldEvent.accountID };
    const update = { friendlyName:req.body.data.newEvent.friendlyName, calendarID:req.body.data.newEvent.calendarID };
    Account.findOneAndUpdate(filter, update, (error,data)=>{
         if(error){
             res.status(500).send({
                 success:false,
                 message:
                   error.message || "Some Some error ocurred while updating the account."
               });
         }
         else{
             res.send({
                 success: true,
                 message: "Account updated successfully!"
             });
         }
    })
 }

 
const deleteAccount = async(req,res) => {
    var log = new Log({
        type:"DELETE",
        group:req.body.group,
        data:JSON.parse(req.body.data),
    })
    log.save(log, (error,data)=>{
        if(error)
            res.status(500).send({
                success:false,
                message:
                error.message || "Some error occurred while creating the log."
            });
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


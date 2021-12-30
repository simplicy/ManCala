import Log from '../../lib/models/log.model'

const createAccount = async(req,res) => {
    console.log("Creating Account")
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
    try{
        log.save(log,  (error,data)=>{
            res.status(200).send({
                success: true,
                data: data,
            })
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: error,
        })
    }
} 

const findAllAccounts = async(req,res) => {
    console.log("Finding Accounts")
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

const deleteAccount = async(req,res) => {
    const toDelete = req.body;
    console.log(toDelete.length)
    
   Log.deleteMany({accountID:{$in:toDelete}}, (error,data)=>{
        if(error){
            res.status(500).send({
                success:false,
                message:
                  error.message || "Some Some error ocurred while deleting products."
              });
        }
        else{
            res.send({
                success: true,
                message: "Account(s) deleted successfully!"
            });
        }
   })
}

const updateAccount = async(req,res) => {
   const filter = { accountID: req.body.accountID };
   const update = { friendlyName:req.body.friendlyName, calendarID:req.body.calendarID };
   Log.findOneAndUpdate(filter, update, (error,data)=>{
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
    

const methods = {
    GET: findAllAccounts,
    PUT: updateAccount,
    POST: createAccount,
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


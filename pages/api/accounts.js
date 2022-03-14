import Account from '../../lib/models/account.model'

const createAccount = async(req,res) => {
    console.log("Creating Account")
    console.log(req.body.id)
    var account = new Account({
        id: req.body.id,
        name: req.body.name,
    });
    try{
        Account.find({id:account.id}, (error, data)=>{
            if(data.length!=0 || error)
                res.status(500).send({
                    success:false,
                    message: error || "Account email exists already, please use another one."
                })
            else
            Account.find({id:account.id}, (error,data)=>{
                if(data.length!=0 || error)
                    res.status(500).send({
                        success:false,
                        message: error || "Account number exists already, please use another one."
                    })
                else
                    account.save(account, (data) => {
                        res.status(200).send({
                            success: true,
                            data: data,
                            message:"Account created successfully."
                        })
                    })
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
    if(req.headers.id)
        condition = {id:req.headers.id}
    try {
        Account.find(condition,(error,data) => {
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
    console.log(req.body)
    const toDelete = req.body.map((data)=>{
        return data.id;
    });

    console.log(toDelete)
    
    
   Account.deleteMany({id:{$in:toDelete}}, (error,data)=>{
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
                data: toDelete,
                message: "Account(s) deleted successfully!"
            });
        }
   })
}

const updateAccount = async(req,res) => {
    console.log(req)
    //need to perform a check to make sure that email is not duplicated in db
   const filter = { id: req.body.id };
   const update = { name:req.body.name, email:req.body.email };
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


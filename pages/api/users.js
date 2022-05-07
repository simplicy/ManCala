
import Account from '../../lib/models/account.model'

const createAccount = async(req,res) => {
    var user ={
        name: req.body.name,
        email: req.body.email,
    };
    console.log(req.body.AccountNumber)
    try{
        Account.updateOne({id:req.body.accountNumber},{$push: {users: user}}, (error,data)=>{
            console.log(data)
            if(error)
                res.status(500).send({
                    success:false,
                    message:"An error occurred."
                })
            else{    
                res.status(200).send({
                    success: true,
                    data: data,
                    message:"Account created successfully."
                })
            }
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: error,
        })
    }
} 

const deleteAccount = async(req,res) => {
    var user ={
        name: req.body.name,
        email: req.body.email,
    };
    console.log(req.body.AccountNumber)
    try{
        Account.updateOne({id:req.body.accountNumber},{$pull: {users: user}}, (error,data)=>{
            console.log(data)
            if(error)
                res.status(500).send({
                    success:false,
                    message:"An error occurred."
                })
            else{    
                res.status(200).send({
                    success: true,
                    data: data,
                    message:"Account removed successfully."
                })
            }
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: error,
        })
    }
}


const methods = {    
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


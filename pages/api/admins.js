import Admin from '../../lib/models/admin.model'

const createAccount = async(req,res) => {
    console.log("Creating Account")
    var admin = new Admin({
        name: req.body.name,
        email: req.body.email,
    });
    try{
        Admin.find({email:req.body.email}, (error,data)=>{
            if(data.length!=0 || error)
                res.status(500).send({
                    success:false,
                    message:"User already exists."
                })
            else
                admin.save(admin, (data) => {
                    res.status(200).send({
                        success: true,
                        data: data,
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
    try {
        Admin.find(condition,(error,data) => {
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
    console.log(toDelete)
   Admin.deleteMany({email:{$in:toDelete}}, (error,data)=>{
       console.log(data)
        if(error){
            res.status(500).send({
                success:false,
                message:
                  error.message || "Some Some error ocurred while deleting account(s)."
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


const methods = {
    GET: findAllAccounts,
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


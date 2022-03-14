import mongoose from 'mongoose'
import { Schema } from 'mongoose'

/* AccountSchema will correspond to a collection in your MongoDB database. */
const AccountSchema = new Schema({
    id: String,
    name: String,   
    users: []
},{ timestamps: true }
);

export default mongoose.models.Account || mongoose.model('Account', AccountSchema)

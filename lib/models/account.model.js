import mongoose from 'mongoose'
import { Schema } from 'mongoose'

/* AccountSchema will correspond to a collection in your MongoDB database. */
const AccountSchema = new Schema({
    accountID: String,
    friendlyName: String,   
    calendarID: String,
},{ timestamps: true }
);

export default mongoose.models.Account || mongoose.model('Account', AccountSchema)

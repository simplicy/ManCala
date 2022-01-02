import mongoose from 'mongoose'
import { Schema } from 'mongoose'

/* LogScheema will correspond to a collection in your MongoDB database. */
const LogSchema = new Schema({
    type: String,
    query:String,
    data: Object,    
},{ timestamps: true }
);

export default mongoose.models.Log || mongoose.model('Log', LogSchema)

import mongoose from 'mongoose'
import { Schema } from 'mongoose'

/* LogScheema will correspond to a collection in your MongoDB database. */
const LogSchema = new Schema({
    type: String,
    data: {
        oldEvent: {
            accountID:Number,
            friendlyName:String,
            calendarID:String,
        },
        newEvent: {
            accountID:Number,
            friendlyName:String,
            calendarID:String,
        }
    }
    
},{ timestamps: true }
);

export default mongoose.models.Log || mongoose.model('Log', LogSchema)

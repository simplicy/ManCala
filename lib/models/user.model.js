import mongoose from 'mongoose'
import { Schema } from 'mongoose'

/* AccountSchema will correspond to a collection in your MongoDB database. */
const UserSchema = new Schema({
    name: String,   
    email: String
});

export default mongoose.models.User || mongoose.model('User', UserSchema)

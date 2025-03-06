import mongoose from "mongoose"

const shipSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    is_default: {
        type: Boolean,
        default: false
    },
    estimated_time:{
        type:Number,
        required:true
    },
    fee: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true, versionKey: false
})

const ShipModel = mongoose.model('ships', shipSchema)

export default ShipModel
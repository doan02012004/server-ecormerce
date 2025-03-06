
import mongoose from "mongoose"

const shipItemSchema = new mongoose.Schema({
    ship_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ships',
        required: true
    },
    min_weight: {
        type: Number,
        required: true
    },
    max_weight: {
        type: Number,
        required: true
    },
    fee: {
        type: Number,
        required: true
    }
}, {
    timestamps: true, versionKey: false
})

const ShipItemModel = mongoose.model('ship_items', shipItemSchema)

export default ShipItemModel
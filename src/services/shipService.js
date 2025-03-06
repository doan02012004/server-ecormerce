import { StatusCodes } from "http-status-codes"
import ShipModel from "../models/ShipModel.js"
import ApiError from "../utils/ApiError.js"
import ShipItemModel from "../models/ShipItemModel.js"

const addShipMain = async (data) => {
    const { estimated_time, fee, name, is_default, status } = data
    const ship = await ShipModel.create({ estimated_time, fee, name, is_default, status })
    if (!ship) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Tạo đơn vị vận chuyển thất bại")
    }
    if (data.items.length > 0) {
        for (const item of data.items) {
            const shipItem = new ShipItemModel({
                ship_id:ship._id,
                ...item
            })
            await shipItem.save()
        }
    }
    return {
        statusCode: 201,
        message: "Tạo đơn vị vận chuyển thành công"
    }
}

const addShipItem = async (ship_id, data) => {
    const ship = await ShipModel.findById(ship_id)
    if (!ship) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Đơn vị vận chuyển không tồn tại")
    }

    const shipItem = new ShipItemModel({
        ship_id,
        ...data
    })

    await shipItem.save()
    return {
        statusCode: 201,
        message: "Tạo phí vận chuyển thành công"
    }
}

const getAllShipAdmin = async () => {
    const ships = await ShipModel.find()
    return ships
}

const getShipAdminById = async(ship_id) => {
    const ship = await ShipModel.findById(ship_id)
    if (!ship) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Đơn vị vận chuyển không tồn tại")
    }
    
    const items = await ShipItemModel.find({ship_id})
    
    return {
        ...ship.toObject(),
        items
    }
}

const updateShipById = async(ship_id,data) => {
    
    const ship = await ShipModel.findByIdAndUpdate(ship_id,data)
    if (!ship) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Đơn vị vận chuyển không tồn tại")
    }
    const items = await ShipItemModel.find({ship_id})
    for(const item of items){
        const reItem = item.toObject()
        const findIndex = data.items.findIndex((shipItem) => {
            if(shipItem._id){
                if(shipItem._id == reItem._id.toString()){
                    return true
                }
            }else{
                return false
            }
        })

        if(findIndex >= 0){
            await ShipItemModel.findByIdAndUpdate(reItem._id, data.items[findIndex])
        }else {
            await ShipItemModel.findByIdAndDelete(reItem._id)
        }
    }

    for(const item of data.items){
        
        if(!item._id){
            const newShipItem = new ShipItemModel({
                ...item,
                ship_id:ship._id
            })
            await newShipItem.save()
        }
    }

    return {
        message:"Cập nhật thành công"
    }
}

export default {
    addShipMain,
    addShipItem,
    getAllShipAdmin,
    getShipAdminById,
    updateShipById
}
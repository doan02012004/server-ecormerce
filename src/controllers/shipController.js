import { StatusCodes } from "http-status-codes"
import shipService from "../services/shipService.js"
import mongoose from "mongoose";

const AddShipMain = async (req, res, next) => {
    const session = await mongoose.startSession(); // Bắt đầu session
    session.startTransaction(); // Bắt đầu transaction
    try {
        const result = await shipService.addShipMain(req.body)
        // Hoàn tất transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(StatusCodes.CREATED).json(result)
    } catch (error) {
        // Hoàn tất transaction
        await session.abortTransaction();
        session.endSession();
        next(error)
    }
}

const AddShipItem = async (req, res, next) => {
    try {
        const ship_id = req.params.ship_id
        const result = await shipService.addShipItem(ship_id, req.body)
        return res.status(StatusCodes.CREATED).json(result)
    } catch (error) {
        next(error)
    }
}


const GetAllShipAdmin = async (req, res, next) => {
    try {
        const data = await shipService.getAllShipAdmin()
        return res.status(StatusCodes.OK).json(data)
    } catch (error) {
        next(error)
    }
}

const GetShipAdminById = async (req, res, next) => {
    try {
        const data = await shipService.getShipAdminById(req.params.ship_id)
        return res.status(StatusCodes.OK).json(data)
    } catch (error) {
        next(error)
    }
}

const UpdateShipAdminById = async (req, res, next) => {
    const session = await mongoose.startSession(); // Bắt đầu session
    session.startTransaction(); // Bắt đầu transaction
    try {
        const data = await shipService.updateShipById(req.params.ship_id,req.body)
          // Hoàn tất transaction
          await session.commitTransaction();
          session.endSession();
        return res.status(StatusCodes.OK).json(data)
    } catch (error) {
         // Hoàn tất transaction
         await session.abortTransaction();
         session.endSession();
        next(error)
    }
}

export default {
    AddShipMain,
    AddShipItem,
    GetAllShipAdmin,
    GetShipAdminById,
    UpdateShipAdminById
}
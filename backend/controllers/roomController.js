const ROOM = require('../models/roomModel')
const mongoose = require('mongoose')

const createRoom = async (req, res) => {
    const {
        name,
        building
    } = req.body

    const { sem } = req.params;
    const emptyFields = []
    if(!name){
        emptyFields.push("name")
    }
    if(!building){
        emptyFields.push("building")
    }
    if(emptyFields.length > 0){
        return res.status(400).json({error: `Invalid Fields: ${emptyFields.map((field)=>field)}`})
    }
    try {
        const createdRoom = await ROOM.create({...req.body, semester: sem})
        return res.status(200).json(createdRoom)
    }catch(error){
        return res.status(400).json({error: error.message})
    }
}

const getSemRooms = async (req, res) => {
    const { sem } = req.params
    try {
        const semRooms = await ROOM.find({semester: sem})
        res.status(200).json(semRooms)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    getSemRooms,
    createRoom,
}
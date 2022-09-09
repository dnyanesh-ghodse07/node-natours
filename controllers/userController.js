const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req,res) =>{
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    })
})
exports.postUser = catchAsync(async (req,res) =>{

    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    })
})
exports.getUser = catchAsync(async (req,res) =>{
    const id = req.params.id;
    const user = await User.findById(id);
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
})
exports.updateUser = catchAsync(async (req,res) =>{
    const id = req.params.id;
    
    const user = await User.findByIdAndUpdate(id, req.body);
    
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
})
exports.deleteUser = catchAsync(async (req,res) =>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    })
})
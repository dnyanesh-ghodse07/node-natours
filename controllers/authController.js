const User = require('../models/userModel');
const {promisify} = require('util');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role
    });

    const token = signToken(newUser._id);
    res.status(201).json({
        status: 'success',
        token,
        message: 'User created',
        data: {
            user: newUser
        }
    })
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    //1 check email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    //2 check if user exist password is correct
    const user =  await User.findOne({ email: email }).select('+password');
    
    if(!user || !await user.correctPassword(password, user.password)){
        return next(new AppError('Incorrect password or email !', 400));
    }

    const token = signToken(user._id);
    //3 if everything ok send token to client
    res.status(200).json({
        status: 'success',
        token
    })
})

exports.protect = catchAsync(async (req, res, next) => {
    //1 ) getting token and check
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return next(new AppError('You are not logged in! Please log in to access', 400));
    }
    //2) validate token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3 check if user still exist
    const currentUser = await User.findById(decoded.id);

    if(!currentUser){
        return next(new AppError('Token benging to this user does no longer exist', 401));
    }
    //4 check if user change password
    if(currentUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed password, Please login again', 401));
    }

    //Grant access to user
    req.user = currentUser;
    next();
})

exports.restricTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have permission to perform this action', 403));
        }
    next();
    };
}
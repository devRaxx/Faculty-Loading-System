const USER = require("../models/userModel");
const jwt = require('jsonwebtoken')
// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { message: '' };

  if(err.message === "Incorrect user name" || "Incorrect password"){
    errors.message = 'Incorrect Username or Password';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.message = 'that user name is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id, userType, userName) => {
  return jwt.sign({id, userType, userName}, process.env.SECRET_KEY, {
    expiresIn: maxAge,
  });
}

module.exports.signup_post = async (req, res) => {
  const { userName, userType ,password } = req.body;

  try {
    const user = await USER.create({ userName, password, userType});
    console.log(user)
    res.status(201).json({userName: user.userName, password: user.password, _id: user._id.toString() ,userType:user.userType});
  }
  catch(err) {
    console.log(err)
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

module.exports.login_post = async (req, res) => {
  const { userName, password } = req.body;
  console.log(req.body)
  try{
    const user = await USER.login(userName, password);
    const token = createToken(user._id, user.userType, user.userName);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.cookie('jwt', token, {maxAge: maxAge * 1000});
    res.status(201).json({user: user._id, userType:user.userType});
  }catch(err){
    const errors = handleErrors(err)
    res.status(401).json({errors});
  }
}

module.exports.signout = async (req,res) => {
  res.clearCookie('jwt').status(200).send('Cookie Cleared')
}
module.exports.user = async (req, res) => {
  const token = req.cookies.jwt;
  if(token){
      jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken)=>{
          if(err){
              res.status(401).json(err);
          }else{
              res.status(200).json({userId:decodedToken.id, userType: decodedToken.userType, userName: decodedToken.userName});
          }
      })
  }else{
      res.status(401).json({error: "Authentication Failure"});
  }
}

module.exports.updateUser = async(req, res) =>{
  const {
    _id,
    userName,
    userType,
    password
  } = req.body
  
  let emptyFields = []

  if (!_id) {
    emptyFields.push('id')
  }
  if (!userName) {
    emptyFields.push('User Name')
  }
  if (!userType) {
    emptyFields.push('User type')
  }
  if (!password) {
    emptyFields.push('password')
  }
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in the neccessary field for Account Update', emptyFields })
  }

  try{
    const updatedUser = await USER.findByIdAndUpdate(_id,{...req.body}, {new: true})
    res.status(200).json(updatedUser)
  }catch(err){
    res.status(400).json(err)
  }
  
}
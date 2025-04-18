const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'Please enter a username'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  },
  userType: {
    type: String,
    required: [true, "Please enter user type"]
  }
});

userSchema.statics.login = async function(userName, password){
    const user = await this.findOne({userName});
    if(user){
        if(user.password === password) {
            return user
        }
      throw Error('Incorrect password')
    }
    throw Error('Incorrect email')
}
const User = mongoose.model('user', userSchema);

module.exports = User;
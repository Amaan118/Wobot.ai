const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    firstname: {
        type: String
    },
    lastName: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    tokens: [{

    }]
})

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign(this._id.toString(), process.env.SECRET_KEY);
    this.tokens = this.tokens.concat(token);

    await this.save();
    return token;
}

const User = mongoose.model("wobot_user", userSchema, "wobot_user");

module.exports = User;
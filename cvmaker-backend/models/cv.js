const mongoose = require("mongoose");

const cvSchema = new mongoose.Schema({
    userId: {type: String, default: null},
    data: [],
    profileImg: {type: String, default: null}
},{
    timestamps: true
})

module.exports = mongoose.model("cvs", cvSchema)
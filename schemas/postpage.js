const mongoose = require('mongoose');

const {schema} = mongoose;
const postpageSchema = new mongoose.Schema({
    num: {
        type: Number,
        required: true,
        unique: true
    },
    date : {
        type: Number,
        required: true,
    },
    title : {
        type: String,
        required: true
    },
    author : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    content : {
        type: String,
        required: true
    },

});

//변경 전:let postpage = mongoose.model("postpage", postpageSchema);
//변경 후 (after mongoose 구조 만들기)
module.exports = mongoose.model("postpage", postpageSchema);
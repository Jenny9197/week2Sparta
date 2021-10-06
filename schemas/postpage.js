const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {schema} = mongoose;
const postpageSchema = new mongoose.Schema({

    date : {
        type: Date,
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
        minlength: 4,
        required: true
    },
    content : {
        type: String,
        required: true
    },
    comment : {
        type: [commentBoxSchema],
        required: false
    }

});

const commentBoxSchema = new Schema ({
    commentbox: {
        type: String,
        required: true
    },
    user : {
        type: String,
        required: true
    },
    date : {
        type: Date,
        required: true
    }
});




//변경 전:let postpage = mongoose.model("postpage", postpageSchema);
//변경 후 (after mongoose 구조 만들기)
module.exports = mongoose.model("postpage", postpageSchema);
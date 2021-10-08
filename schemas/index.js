const mongoose = require("mongoose");

const connect = () => {
    mongoose
        //robo3t 및 aws 에서 IPV4주소 생성 후에는 수정하기!!!
        .connect("mongodb://localhost:27017/voyage", {
            useNewUrlParser: true,
            ignoreUndefined: true
        })
        .catch(err => console.log(err));
};

mongoose.connection.on("error", err => {
    console.log("몽고디비 연결 에러", err);
});

module.exports = connect;
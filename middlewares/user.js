//미들웨어 생성부분
const jwt = require("jsonwebtoken");
const User = require("../schemas/login");

module.exports = (req, res, next) => {
  let getToken = req.cookies.user;

  //토큰이 없을경우
  if (!getToken) {
    res.status(401).send({
      errorMsg: "로그인 후 이용 가능한 기능입니다.",
    });
    return;
  }
  //로그인 후 사용할 수 있도록 함
  try {
    const { userId } = jwt.verify(getToken, "customized-secret-key");
    //로그인할때, 닉네임 사용을 원하기 때문에 userId로 저장
    User.findOne({ nickname: userId }).then((user) => {
      //res.local에 저장한다
      res.locals.user = user;
      next();
    });
  } catch (err) {
    res.status(401).send({
      errorMsg: "로그인 후 이용 가능한 기능입니다.",
    });
  }
};

const express = require("express");
const bcrypt = require("bcrypt");
const saltRound = 10;
const postpage = require("../schemas/postpage");
const newuser = require("../schemas/login");
const signupAuth = require("../routers/signup");
const jwt = require("jsonwebtoken");
const { db } = require("../schemas/postpage");

const router = express.Router();

router.post("/serve", async (req, res, next) => {
  try {
    const { date, title, author, password, content } = await req.body;

    //console.log(date, title, author);
    await postpage.create({
      date: date,
      title: title,
      author: author,
      password: password,
      content: content,
    });
    res.send({ result: "success" }); //여기서 success는 태그의 의미 값이다
  } catch (err) {
    console.error(err);
    next(err);
  }
});

//회원가입 구현하기(10.04.2021)
router.post("/register", async (req, res) => {
  const { email, nickname, password1, password2 } = req.body;

  if (
    signupAuth.nickAuth(nickname) &&
    signupAuth.pwAuth(password1, password2)
  ) {
    let exist = await newuser.find({ nickname });

    //console.log("여기는 true");
    if (!exist.length) {
      await newuser.create({ email, password1, nickname });
      res.send({
        result: "success",
        msg: "성공",
      });
      return;
    } else {
      // console.log("여기는 중복");
      res.send({
        result: "Fail",
        msg: "중복된 닉네임입니다",
      });
      return;
    }
  } else {
    //console.log("여기는 실패");
    res.send({
      result: "Fail",
      msg: "닉네임 또는 비밀번호 확인해주세요",
    });
    //res.send({result : "success"});
    return;
  }
});

//게시글 목록 조회(post_page)
router.get("/list", async (req, res, next) => {
  try {
    const postpages = await postpage.find({}).sort("-_id"); //db
    res.send({ list: postpages }); //db에서 postpage를 불러서 데이터가 res.send 값으로 보내주는것
  } catch (err) {
    console.error(err);
    next(err);
  }
});

//작성페이지 상세조회(inquire_page)
//:_id 에 params 값이 저장
router.get("/writedetail/:_id", async (req, res, next) => {
  const postId = req.params;
  console.log(postId);
  try {
    const inquirelist = await postpage.findOne({ _id: postId });
    res.json({ inquirelist: inquirelist });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/signIn", async (req, res) => {
  const { nickname, password1 } = req.body;
  const user = await newuser.findOne({ nickname });
  var cookie = require('cookie-parser');

  // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses

  if (!user || password1 !== user.password1) {
    res.status(400).send({
      errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
    });
    return;
  }
  res.cookie("user",token,{maxAge: 300000})
  // res.send({
  //   token: jwt.sign({ userId: user.nickname }, "customized-secret-key"), //token 발급됨
    
    
  // });
});

//게시글 삭제 기능
router.delete("/writedetail/:_id", async (req, res, next) => {
  const postId = req.params;
  const {password} = req.body;
  
  try {
    const postingpwd = await postpage.findOne({_id:postId});

    if(postingpwd["password"] === password){
      await postingpwd.deleteOne();
    //   await postpage.deleteOne({ _id: postId });
      res.status(200).send({ msg: "삭제완료하였습니다" });
    } else {
        res.status(400).send({ msg: "비밀번호를 다시 입력해주세요"});
    }
  } catch (err) {
        res.status(400).send({ msg: "존재하지 않는 게시물입니다" });
  }
});

//게시글 수정 기능
router.patch("/writedetail/:_id", async (req, res, next) => {
  try {
    const postId = req.params;
    const { title, password, content } = await req.body; //data
    console.log(title, password, content)
    //페이지 찾기
    const posting = await postpage.findOne({ _id: postId });
    console.log(posting)
    //db.collection.update({ updateQuery });
    if (posting["password"] === password) {
      await posting.updateOne({ title, content });
      await posting.save();
      res.status(200).send({ msg: "수정완료하였습니다" });
    } else {
        res.status(400).send({msg: "비밀번호 불일치"})
    }
  } catch (err) {
    res.status(400).send({ msg: "수정 글이 완성되지 못했습니다" });
  } //error catch
});

module.exports = router;

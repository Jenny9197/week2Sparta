const express = require("express");
const bcrypt = require("bcrypt");
const saltRound = 10;
const postpage = require("../schemas/postpage");
const newuser = require("../schemas/login");
const signupAuth = require("../routers/signup");
const jwt = require("jsonwebtoken");
const { db } = require("../schemas/postpage");

//미들웨어 user.js insertion
const userIdCheck = require("../middlewares/user");

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
    const postpages = await postpage.find({}).sort("-date"); //db
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

//로그인
router.post("/signIn", async (req, res) => {
  const { nickname, password1 } = req.body;
  const user = await newuser.findOne({ nickname });
  var cookie = require("cookie-parser"); //쿠키 생성

  if (!user || password1 !== user.password1) {
    res.status(400).send({
      errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
    });
    return;
  }

  //token 생성
  let token = jwt.sign({ userId: user.nickname }, "customized-secret-key"); //token 발급됨
  //cookie 안에 user 이름으로 token을 저장 (180분)
  res.cookie("user", token, { maxAge: 1000 * 60 * 60 }),
    //정상작동되었음을 알려줌
    res.status(200).send({});

  // let token = jwt.sign({ id: users["id"] , name: users["name"] }, secretObj.secret ,{expiresIn: '5m' })
});

//로그인 사용자가 페이지에 접속한 경우
//페이지 접속 시 로그인한 상태에서만 가능 (middleware 활용)
router.get("/checkSign", userIdCheck, async (req, res) => {
  res.status(200).send({ success: "로그인이 되어 있습니다." });
});

//게시글 삭제 기능
router.delete("/writedetail/:_id", async (req, res, next) => {
  const postId = req.params;
  const { password } = req.body;

  try {
    const postingpwd = await postpage.findOne({ _id: postId });

    if (postingpwd["password"] === password) {
      await postingpwd.deleteOne();
      //   await postpage.deleteOne({ _id: postId });
      res.status(200).send({ msg: "삭제완료하였습니다" });
    } else {
      res.status(400).send({ msg: "비밀번호를 다시 입력해주세요" });
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
    console.log(title, password, content);
    //페이지 찾기
    const posting = await postpage.findOne({ _id: postId });
    console.log(posting);
    //db.collection.update({ updateQuery });
    if (posting["password"] === password) {
      await posting.updateOne({ title, content });
      await posting.save();
      res.status(200).send({ msg: "수정완료하였습니다" });
    } else {
      res.status(400).send({ msg: "비밀번호 불일치" });
    }
  } catch (err) {
    res.status(400).send({ msg: "수정 글이 완성되지 못했습니다" });
  } //error catch
});
//........................................................................................//
//댓글 작성 기능
//댓글 작성 시 로그인한 상태에서만 가능 (middleware 활용)
router.post("/commentwrite/:_id", userIdCheck, async (req, res) => {
  try {
    const postId = req.params;
    const { date, user, commentbox } = await req.body;

    const updatetext = await postpage.findOneAndUpdate(
      { _id: postId },
      {
        $push: {
          comment: {
            date,
            user,
            commentbox,
          },
        },
      }
    );
    updatetext.save();
    res.status(200).send({ msg: "댓글 작성 완료했습니다" });
  } catch {
    res.status(400).send({ msg: "댓글 내용을 입력해주세요" });
  }
});
//..........................................................................................
//댓글 삭제 기능
//댓글 삭제 시 로그인한 상태에서만 가능 (middleware 활용)
router.delete("/commentwrite/:_id", userIdCheck, async (req, res) => {
  const postId = req.params;
  const { _dbId } = req.body; //find which 댓글

  try {
    const post = await postpage.findOne({ _id: postId }); //게시글찾기
    if (post === null) {
      //post==parents, comment=child
      res.status(400).send({ msg: "존재하지 않는 게시물입니다" });
    }
    const storage = post.comment.id(_dbId); // (==findbyId), subdocument 방식, POST 에 COMMENT 의 아이디값인 dbId를 찾기
    storage.remove(); //subdocument 에서 찾아서 제거함
    post.save(); //부모를 저장함
    res.status(200).send({ msg: "댓글 삭제를 완료했습니다" });
  } catch (err) {
    res.status(400).send({ msg: "더이상 댓글이 존재하지 않습니다" });
  }
});
//................................................................................................
//댓글 수정 기능
//댓글 수정 시 로그인한 상태에서만 가능 (middleware 활용)
router.patch("/commentwrite/:_id", userIdCheck, async (req, res) => {
  const postId = req.params;
  const { modifyContent, _dbId } = req.body;
  console.log(modifyContent);
  console.log(_dbId);
  try {
    const post = await postpage.findOne({ _id: postId }); //게시글찾기
    if (post === null) {
      //post==parents, comment=child
      res.status(400).send({ msg: "댓글 내용이 있는지 확인해주세요" });
    }
    const storage = post.comment.id(_dbId); // (==findbyId), subdocument 방식, POST 에 COMMENT 의 아이디값인 dbId를 찾기
    storage.commentbox = modifyContent; //subdocument에서 commentbox를 comment로 교체
    post.save(); //부모를 저장함
    res.status(200).send({ msg: "댓글 수정을 완료했습니다" });
  } catch (err) {
    res.status(400).send({ msg: "더이상 댓글이 존재하지 않습니다" });
  }
});
//.............................................................
//댓글 목록 조회
router.get("/commentreview/:_id", async (req, res, next) => {
  try {
    const postId = req.params;

    const postpages = await postpage.find({ _id: postId }).sort("-_id"); //db
    res.send({ list: postpages }); //db에서 postpage를 불러서 데이터가 res.send 값으로 보내주는것
  } catch (err) {
    console.error(err);
    next(err);
  }
});
module.exports = router;

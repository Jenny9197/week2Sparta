//심화과제 app.js 와 같은 파일
const express = require("express");
//심화과제 add
//const bodyParser = require('body-parser');
const mongoose = require("mongoose");
//jwt
const jwt = require("jsonwebtoken");
//cookie-parser for 미들웨어
var cookieParser = require("cookie-parser");

//컴퓨터에 todo-demo라는 데이터베이스에 연결
mongoose.connect("mongodb://localhost:27017/testtest", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();

const mod_page = require("./schemas/postpage.js");

//purpose: express에서 웹서버 요청때 데이터 전달을 용이하게 해주기 위해 미들웨어가 필요함
//api enter => middleware connect
//app.use('/api', express.json(), router);
//assets에 있는 파일을 그대로 서버 가능
//app.use(express.static('./assets'));

//static 파일 등록
app.use("/public", express.static("public"));

//미들웨어를 사용하기 위해 필요한 설치 (데이터 가공역할)
app.use(express.urlencoded({ extended: true }));

//데이터를 쉽게 이용할 수 있도록 제공해주는 미들웨어 역할 (데이터 가공역할)
app.use(express.json());

//미들웨어를 정적(static)으로 제공해주는 역할
app.use(express.static("public"));

//쿠키 parser 미들웨어 추가
app.use(cookieParser());
//미들웨어 처리
app.use((req, res, next) => {
  //console.log(req);
  next();
});

const postPageRouter = require("./routers/postpage");
app.use("/api", postPageRouter);

//api 해당되는 파일들을  postpage에 저장 for api Server

//Adding to install ejs
//purpose: Recall file from ejs in webpage
//ejs 템플릿 엔진을 위해 필요한 조건
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

//views/main_page.ejs로 이동
app.get("/", (req, res) => {
  return res.render("main_page");
});
//views/post_page.ejs 로 이동 목록페이지
app.get("/list", (req, res) => {
  return res.render("post_page");
});
//views/write_page.ejs 로 이동 쓰기페이지
app.get("/writedetail", (req, res) => {
  return res.render("write_page");
});
//views/inquire_page.ejs 로 이동 상세페이지
app.get("/inquire", (req, res) => {
  //data received from querystring
  //res.render('inquire_page')
  return res.render("inquire_page");
});
//views/fix_page.ejs 로 이동 수정페이지
app.get("/modify", (req, res) => {
  //유일한 object 값을 가진 데이터를 찾는 작업// mongodb=전체(지구 같은 역할) //sept 29, 2020, 17:30pm done by here
  //let selectone = req.query
  //const mod_item = await mod_page.findOne({selected:selectone});

  //렌더링하는 작업
  return res.render("fix_page");
});

////////////////////////////////////////////////
//views/new_join.ejs 로 이동
app.get("/register", (req, res) => {
  return res.render("new_join");
});

//views/login_page.ejs 로 이동
app.get("/signIn", (req, res) => {
  return res.render("login_page");
});

//서버가동//심화과제 edit
app.listen(8080, () => {
  //console.log(`listening at http://localhost:${port}`) 기본과제
  console.log("Server on");
});

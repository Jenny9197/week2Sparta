const express = require('express')
const app = express()
const port = 3000

const connect = require('./schemas');
connect();

//purpose: express에서 웹서버 요청때 데이터 전달을 용이하게 해주기 위해 미들웨어가 필요함

//미들웨어를 사용하기 위해 필요한 설치 (데이터 가공역할)
app.use(express.urlencoded({extended: false}))
//데이터를 쉽게 이용할 수 있도록 제공해주는 미들웨어 역할 (데이터 가공역할)
app.use(express.json())
//미들웨어를 정적(static)으로 제공해주는 역할
app.use(express.static('public'));
//미들웨어 처리
app.use((req, res, next) => {
    //console.log(req);
    next();
});

const postPageRouter = require('./routers/postpage');
app.use('/api', postPageRouter);
//api 해당되는 파일들을  postpage에 저장 for api Server

//Adding to install ejs
//purpose: Recall file from ejs in webpage

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



//전체 게시글 목록 조회 페이지
app.get('/list', (req, res) => {
    res.render('post_page')
});
//게시글 작성 페이지
app.get('/writedetail', (req, res) => {
    res.render('write_page')
});
//게시글 조회 페이지
app.get('/inquire', (req, res) => {
    res.render('inquire_page')
});
//게시글 수정 페이지
app.get('/modify', (req, res) => {
    res.render('fix_page')
});
//게시글 삭제 페이지
app.get('/remove', (req, res) => {
    res.render('delete_page')
});

//서버가동
app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})


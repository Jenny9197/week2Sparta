const express = require('express')
const app = express()
const port = 3000
const mod_page = require('./schemas/postpage.js')

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
//ejs 템플릿 엔진을 위해 필요한 조건
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



//views/main_page.ejs로 이동
app.get('/', (req, res) => {
    res.render('main_page')
});
//views/post_page.ejs 로 이동
app.get('/list', (req, res) => {
    res.render('post_page')
});
//views/write_page.ejs 로 이동 
app.get('/writedetail', (req, res) => {
    res.render('write_page')
});
//views/inquire_page.ejs 로 이동 
app.get('/inquire', (req, res) => { //data received from querystring
    res.render('inquire_page')
});
//views/fix_page.ejs 로 이동 
app.get('/modify', (req, res) => {
    //유일한 object 값을 가진 데이터를 찾는 작업// mongodb=전체(지구 같은 역할) //sept 29, 2020, 17:30pm done by here
    //let selectone = req.query
    //const mod_item = await mod_page.findOne({selected:selectone});
   
    //렌더링하는 작업
    res.render('fix_page')
});


//서버가동
app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})


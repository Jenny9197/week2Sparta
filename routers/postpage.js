const express = require('express');
const bcrypt = require('bcrypt');
const postpage = require('../schemas/postpage');

const router = express.Router();

router.post("/post", async (req, res, next) =>{
    try {
        const { num, date, title, author, password, content } = await req.body;
        console.log(num, date, title);
        //const encryptedPassword = bcrypt.hashSync(password, 12) //
        await postpage.create ({
            num:num,
            date:date, 
            title:title,
            author:author, 
            password:password,
            content:content
        });
        res.send({result:"success"});
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//게시글 목록 조회
router.get("/contents", async (req, res, next) => {
    try {
        const postpages = await postpage.find({  }).sort(" date");
        res.json({postpages: postpages}); //response가 json형식으로 quote 저장 
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//작성페이지 상세조회
router.get("/writedetail/:num", async (req, res) => {
    const { num } = req.params;
    const postpage = await postpage.findItem({ num : num });
    res.json({writedetail: postpage});
});

//게시글 수정
router.put("/inquire/:num", async (req, res) => {
    const {num} = req.params;
    const {date, title, author, password, content} = req.body;
    const postpage = await postpage.findItem({num:num});

    console.log(bcrypt.compareSync(pwd, postpage["password"]))

    if(!bcrypt.compareSync(password, postpage["password"])){
        res.send({ result: "fail"});
    } else{
        await postpage.update({num}, {$set:{title}})
        await postpage.update({num}, {$set:{author}})
        await postpage.update({num}, {$set:{content}})
        res.send({ result: "success"});
    }
});

//게시글 삭제
router.get("/delete/:num", async (req, res) => {
    console.log('GET : /deleteBoard 삭제폼 요청');
    const board_no = parseInt(req.params.board_no);
    console.log(board_no);
    res.render('deleteBoard',{deleteBoard:board_no});
});   
router.post('/deleteBoard', (req, res) => {
    console.log('POST : /deleteBoard 삭제처리');
    const board_no = req.body.board_no;
    const board_pw = req.body.board_pw;
    conn.query('DELETE FROM board WHERE board_no=? AND board_pw=?'
            ,[board_no, board_pw], (err, rs) => {
        if(err) {
            console.log(err);
            res.end();
        }else {
            res.redirect('boardList');
        }
    });
});



//게시글 검색
router.get("/seek", async (req, res) => { //from title
    const {seekcontent, category} = req.query;
    if(category == "title"){
        const info = await postpage.find({title: new RegExp(seekcontent)}).sort("-date")
        res.json({info:info});
    }
    else if(category == "author"){ //from author
        const info = await postpage.find({author: new RegExp(seekcontent)}).sort("-date")
        res.json({info:info});
    }
    else if(category == "date"){ //from date
        const info = await postpage.find({date: new RegExp(seekcontent)}).sort("-date")
        res.json({info:info});
    }
    else if(category == "etc"){//entire 
        console.log(seekcontent)
        const info = await postpage.find({$or: [{title: new RegExp(seekcontent)}, {author: new RegExp(seekcontent)}, {date: new RegExp(seekcontent)}]}).sort("-date")
        console.log(info)
        res.json({info:info})
        //find the item out of three 
    }
    else {
        const err = new Error("No search to find objects")
        err.status = 404
        throw err
    }
    const postpage = await Post.find({$or: options})
});

module.exports = router;


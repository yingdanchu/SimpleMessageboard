var express = require('express');
var session = require('express-session')
var bodyParser = require('body-parser')
var db = require('./db');
var id = 0;

var app = express();

// 使用 session(做出cookie登入功能)，要設定一個 secret key
app.use(session({
  secret: 'keyboard cat',
  resave: true,                       
  saveUninitialized: true             
}))

// 有了這個才能透過 req.body 取東西
app.use(bodyParser.urlencoded({ extended: false }))
//使用ejs取代部分html
app.set('view engine', 'ejs');

// 首頁，直接輸出所有留言
app.get('/', function (req, res) {

  // 確認session 裡面有沒有 username 可以拿
  // 判斷是否是管理員(97行 帳號:peter；密碼:123)
  var username = req.session.username;
  var isAdmin = false;
  if (username) {
    isAdmin = true;
  }

  // 拿出所有的留言
  db.getPosts(function (err, posts) {
    if (err) {
      res.send(err);
    } else {

      // 把index.ejs的username,isAdmin posts變數做對應
      res.render('index', {
        username: username,
        isAdmin: isAdmin,
        posts: posts
      });
    }
  })
});

// 刪除文章
app.get('/posts/delete/:id', function (req, res) {
  var id = req.params.id;
  db.deletePost(id, function (err) {
    if (err) {
      res.send(err);
    } else {

      // 成功後導回首頁
      res.redirect('/');
    }
  })
})


// 發表新文章的頁面
app.get('/posts', function (req, res) {
  //導入newpost.ejs
  res.render('newpost');
})

// 新增文章

app.post('/posts', function (req, res) {
  var author = req.body.author;
  var content = req.body.content;

  // 文章 id 採用從1開始疊加
  db.addPost({
    author: author,
    content: content,
    createTime: new Date(),
    id: id = id + 1
  }, function (err, data) {
    if(err) {
      res.send(err)
    } else {
      res.redirect('/');
    }
  })
})

// 輸出登入頁面
app.get('/login', function (req, res) {
  //導向login.ejs
  res.render('login');
})

// 登入，如果帳號密碼是 peter 123 就登入通過
app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  if (username === 'peter' && password === '123') {
    console.log('login success');
    req.session.username = 'peter';
  }
  res.redirect('/');
})

// 登出，清除 session
app.get('/logout', function(req, res) {
  req.session.destroy();
  //導向首頁
  res.redirect('/')
})
//port為3000
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
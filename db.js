var fs = require('fs');
var FILENAME = 'data.json'

var DB = {
  //新增文章
  addPost: function (post, cb) {
    DB.getPosts(function (err, posts) {
      if (err) {
        return cb(err);
      }
      posts.push(post);
      DB.savePosts(posts, cb);
    })
  },
  //刪除文章
  deletePost: function (id, cb) {
    DB.getPosts(function (err, posts) {
      if (err) {
        return cb(err);
      }
      var index = -1;
      for(var i = 0; i < posts.length; i++) {
        if(posts[i].id == id) {
          index = i;
          break;
        }
      }
      if (index >=0 ){
        posts.splice(index, 1);
      }
      DB.savePosts(posts, cb);
    })
  },
  //將資料儲存到data.json中做更新
  savePosts: function (data, cb) {
    fs.writeFile(FILENAME, JSON.stringify(data), cb);
  },
  //讀data.json檔，並且把資料丟到做第一步處理丟到function中
  getPosts: function (cb) {
    fs.readFile(FILENAME, 'utf8', function (err, data) {
      if (err) {
        cb(err);
      } else {
        cb(err, JSON.parse(data));
      }
    })
  }
}

module.exports = DB;
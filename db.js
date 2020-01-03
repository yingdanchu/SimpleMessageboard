/*
var fs = require('fs');
var FILENAME = 'data.json'
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

var db = mongoose.connection;

var PosterSchema = new Schema({
    author: {
        type: String,
        required: true, 
    },
    content: {
        type: String,
        required: true,
    },
    createTime: {
        type: String
    },
    id: {
        type: String
    }
});

var Poster = mongoose.model('Poster', PosterSchema);

var DB = {
  
  //新增文章
  addPost: function (post, cb) {
    var user = new Poster({
        id:post.id,
        author:post.author,
        content:post.content,
        createTime: new Date()
    });
    user.save(function(err, result){
        if(err) {
            return cb(err);
            console.log('保存失敗');
        } else {
            console.log("保存成功");
            console.log(result);
            cb(err, post);
        }
    }) 
  },
  /*
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
  */
  //讀database，並且把資料丟到做第一步處理丟到function中
  getPosts: function (cb) {
    Poster.find(function(err,data) {
        if(err) {
            cb('查詢失敗');
        } else {
            console.log("查詢成功");
            cb(err, data);
        }
    })
  }
};

module.exports = DB;
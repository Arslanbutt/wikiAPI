const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{
  useNewUrlParser: true,
 useUnifiedTopology: true
});

const articleSchema = {
  title : String,
  content : String
};

const Article = mongoose.model("Article",articleSchema);


app.route('/articles')
.get(function(req,res){
  Article.find({},function(err,foundArticles){
    if(!err){
      //console.log(foundArticles);
      res.send(foundArticles);
    }else{
      res.send(err);
    }
  });
})
.post(function(req,res){
  const title = req.body.title;
  const content = req.body.content;

  const article = new Article({
    title : title,
    content : content
  });
  article.save(function(err){
    if(!err){
      res.send("Success");
    }else{
      res.send(err);
    }
  });
})
.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Success");
    }else{
      res.send(err);
    }
  });
});

app.route('/articles/:articleTitle')
.get(function(req,res){
  Article.findOne({title : req.params.articleTitle},function(err,foundArticle){
    if(!err){
      if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No article found");
    }
    }else{
      res.send(err);
    }
  });
})
.put(function(req,res){
  Article.update(
    {title : req.params.articleTitle},
    {title : req.body.title, content: req.body.content},
    {overwrite : true},
    function(err,result){
    if(!err){
      res.send("Updated article");
    }else{
      res.send(err);
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

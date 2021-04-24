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


app.get('/articles',function(req,res){
  Article.find({},function(err,foundArticles){
    if(!err){
      //console.log(foundArticles);
      res.send(foundArticles);
    }else{
      res.send(err);
    }
  });
});


app.post('/articles',function(req,res){
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

});

app.delete('/articles',function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Success");
    }else{
      res.send(err);
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://127.0.0.1:27017/nodekb');
let db = mongoose.connection;



// check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

// // check for db errors
db.on('error', function(err){
  console.log(err);
});

// // init app
const app = express();

// // bring in models
let Article = require('./models/article');


// // load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// set public folder 
app.use( express.static(path.join(__dirname, 'public')));




// // home route
app.get('/', function (req, res)  {

   Article.find().then(( articles) =>{

    if(articles){
         res.render('index', {
        title: 'Articles',
        articles: articles
     });
      
    } else {
      console.log(err);
    }
  });

});

// get single article
app.get('/article/:id', async(req, res)=>{
  

  await Article.findById().then(req.params.id, (err, article)=>{

    if(req.params.id){
      res.render('article.pug', {
      article: article

    });
  } else {
    console.log(err)
  }
  });
});



  

  // let articles = [
  //   {
  //     id:1,
  //     title: 'Article One',
  //     author: 'Hema Latha',
  //     body: 'This is article one'
  //   },
  //   {
  //     id:2,
  //     title: 'Article Two',
  //     author: 'Hema',
  //     body: 'This is article two'
  //   },
  //   {
  //     id:3,
  //     title: 'Article Three',
  //     author: 'Hema Latha',
  //     body: 'This is article three'
  //   },
  // ];

 


// // add route
app.get('/articles/add', function(req, res){
  res.render('add_article', {
    title: 'Add Article'
  });
});

// Add Submit POST Route
app.post('/articles/add', function(req, res){
 let article = new Article();
 article.title = req.body.title;
 article.author = req.body.author;
 article.body = req.body.body;

 article.save().then(function(err){
  
   if(article) {
    res.redirect('/');
  } else {
    console.log(err);
    return;
  }
 });
});

// start server
app.listen(3000, function ()  {
  console.log('Server started on port 3000...');
});

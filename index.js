/** 
RESTFUL SERVICE USING NODEJS
AUTHER:Ecurut Andrew (A.J)
UPDATE: 10/01/2019
*/

var express = require('express');
var mysql = require('mysql');
var bodyparser = require('body-parser');

//connect to the MySQL server
var con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'0205712000',
    database:'android_comicapp' //databes name
})


//fixing the memory leak
require("events").EventEmitter.defaultMaxListeners = 20;

//Create RESTFull
var app = express();
//static dir to display image local by url
var publicDir=(__dirname+'/public/'); 
app.use(express.static(publicDir));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

//Get All Banners
app.get("/banner", (req,res,next)=>{
    con.query('SELECT * FROM banner', function(error,result,fields){
        con.on('error', function(err){
            console.log('[MYSQL ERROR]', err);
        });
        if(result && result.length){

            res.end(JSON.stringify(result));

        }else{

            res.end(JSON.stringify("No banner Available"));
        }

    })

});


//Getting all Comics
app.get("/comic", (req,res,next)=>{
    con.query('SELECT * FROM manga', function(error,result,fields){
        con.on('error', function(err){
            console.log('[MYSQL ERROR]', err);
        });
        if(result && result.length){

            res.end(JSON.stringify(result));

        }else{

            res.end(JSON.stringify("No Comic Available"));
        }

    })

});

//getting a chapter by manga ID
app.get("/chapter/:mangaid", (req,res,next)=>{
    con.query('SELECT * FROM chapter WHERE mangaID=?', req.params.mangaid, function(error,result,fields){
        con.on('error', function(err){
            console.log('[MYSQL ERROR]', err);
        });
        if(result && result.length){

            res.end(JSON.stringify(result));

        }else{

            res.end(JSON.stringify("No Chapter Available"));
        }

    })

});
//getting a IMAGES by CHAPTER ID
app.get("/link/:chapterid", (req,res,next)=>{
    con.query('SELECT * FROM link WHERE chapterid=?', req.params.chapterid, function(error,result,fields){
        con.on('error', function(err){
            console.log('[MYSQL ERROR]', err);
        });
        if(result && result.length){

            res.end(JSON.stringify(result));

        }else{

            res.end(JSON.stringify("No Chapter Available"));
        }

    })

});


//Getting all Category
app.get("/categories", (req,res,next)=>{
    con.query('SELECT * FROM category', function(error,result,fields){
        con.on('error', function(err){
            console.log('[MYSQL ERROR]', err);
        });
        if(result && result.length){

            res.end(JSON.stringify(result));

        }else{

            res.end(JSON.stringify("No Category Available"));
        }

    })

});

//Getting all Filter
app.post("/filter", (req,res,next)=>{
    
    var post_data = req.body; //GET POST DATA from POST Request
    var array=JSON.parse(post_data.data); //PARSE 'data' FROM POST REQUEST TO JSON ARRAY
    var query="SELECT * FROM manga WHERE ID IN (SELECT MangaID FROM mangacategory"; //default query
    if(array.length > 0){
        query += "GROUP BY MangaID ";
        if(array.length == 1) //if user just submit 1 category
        query+="HAVING SUM(CASE WHEN CategoryID ="+array[0]+"THEN 1 ELSE 0 END) > 0)";
        else{//user submits more thean one category
            for(var i = 0; i<array.length;i++){
                if(i == 0) //frst condition
                query+="HAVING SUM(CASE WHEN CategoryID ="+array[0]+"THEN 1 ELSE 0 END) > 0 AND";
                else if(i == array.length-1)//last condition
                query+="SUM (CASE WHEN CategoryID ="+array[i]+"THEN 1 ELSE 0 END )>0)";
                else
                query+="SUM (CASE WHEN CategoryID ="+array[i]+"THEN 1 ELSE 0 END )>0 AND";
            }
        }

        con.query(query, function(error,result,fields){
            con.on('error', function(err){
                console.log('[MYSQL ERROR]', err);
            });
            if(result && result.length){
    
                res.end(JSON.stringify(result));
    
            }else{
    
                res.end(JSON.stringify("No comic Available here"));
            }
    
        })

    }


});
//Search Manga by Name.
app.post("/search",(req,res,next)=>{

    var post_data = req.body; //get body post
    var name_search = post_data.search; //GET 'search' from the POST request

    var query = "SELECT *FROM manga WHERE Name LIKE'%"+name_search+"%'";
    con.query(query, function(error,result,fields){
        con.on('error', function(err){
            console.log('[MYSQL ERROR]', err);
        });
        if(result && result.length){

            res.end(JSON.stringify(result));

        }else{

            res.end(JSON.stringify("No search result here"));
        }

    })


});


//Start server
app.listen(3000,()=>{
    console.log('Comic App API running on port 3000');
})
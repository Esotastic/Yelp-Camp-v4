var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    // Comment    = require("./models/comment"),
    // User       = require("./model/user"),
    seedDB     = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp_v3");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();

//Schema setup

app.get("/", function(req, res){
  res.render("landing");
});


//RESTful new campground creation

//INDEX - shows all campgrounds currently in DB
app.get("/campgrounds", function(req, res){
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
       res.render("index", {campgrounds: allCampgrounds});
    }
  });
});

//NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res){
  res.render("new");
});

//CREATE - creates new campgrounds and reroutes to INDEX
app.post("/campgrounds", function(req, res){
  //get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name: name, image: image, description: desc};
  //Create a new campground and save to database
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){
        console.log(err);
    }else{
      res.redirect("/campgrounds");
    }
  });
});

//SHOW - shows more info about a single campground
app.get("/campgrounds/:id", function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err){
      console.log(err);
    }else{
      res.render("show", {campground: foundCampground});
    }
  });
});

app.listen(3000, "localhost", function(){
  console.log("YelpCamp server is running.");
});

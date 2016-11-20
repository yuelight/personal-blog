// 随机插入大量的文章数据

var loremipsum = require('lorem-ipsum'),
	slug = require('slug'),
	config = require('./config/config'),
	glob = require('glob'),
	mongoose = require('mongoose');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});

var Post = mongoose.model("Post");
var User = mongoose.model("User");
var Category = mongoose.model("Category");

User.findOne(function (err, user) {
	if (err) { 
		return console.log("connot find user"); 
	}

	Category.find(function (err, categories) {
		for (var i = 0; i < 35; i++) {
			if(err) {
				return console.log("connot find category");
			}
			categories.forEach(function (category) {
				var title = loremipsum({ count: 1, units: "sentence" });
				var post = new Post({
					title: title,
					slug: slug(title),
					content: loremipsum({ count: 30, units: "sentence" }),
					category: category,
					author: user,
					published: true,
					meta: {favorites: 0},
					comments: [ ],
					created: new Date
				});

				post.save(function (err, post) {
					console.log("savad post: ", post.slug);
				});
			});
		}
	});
});
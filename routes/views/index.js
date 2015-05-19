var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	locals.data = {
		posts: [],
		news: []
	};
	// Load the posts
	view.on('init', function(next) {

		var q = keystone.list('Post').paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 10
			})
			.where('state', 'published')
			.sort('-publishedDate')
			.populate('author categories');

		if (locals.data.category) {
			q.where('categories').in([locals.data.category]);
		}

		q.exec(function(err, results) {
			locals.data.posts = results;
			next(err);
		});

	});

	view.on('init', function(next) {
		var q = keystone.list('NewsItem').model.find({
			state: 'published'
		})
		.sort('-publishedDate')
		.limit(10)
		.populate('author categories');
		
		q.exec(function(err, result) {
			locals.data.news = result;
			next(err);
		});
	}); 

	// Render the view
	view.render('index');

};

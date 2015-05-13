var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Init locals
	locals.section = 'news';
	// locals.filters = {
	// 	category: req.params.category
	// };
	locals.data = {
		news: []//,
		// categories: []
	};
	
	// Load news
	view.on('init', function(next) {
		
		var q = keystone.list('NewsItem').paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 10
			})
			.where('state', 'published')
			.sort('-publishedDate')
			.populate('author');
		
		// if (locals.data.category) {
		// 	q.where('categories').in([locals.data.category]);
		// }
		
		q.exec(function(err, results) {
			locals.data.news = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('news');
	
};

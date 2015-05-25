var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = req.params.contentpage;
	locals.data = {};
	locals.filters = {
		page: req.params.contentpage
	};

	// Render the view
	// view.render('gallery');

	view.on('init', function(next) {

		var q = keystone.list('ContentPage').model
		.findOne({
			state: 'published',
			slug: locals.filters.page
		})
		.populate('widget');
		

		
		q.exec(function(err, result) {
			locals.data.contentpage = result;
			next(err);
		});

	});

	view.render('contentpage');
};

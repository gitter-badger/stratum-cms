var keystone = require('keystone');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    locals.section = req.params.contentcategory;
    locals.data = {};
    // locals.filters = {
    // 	post: req.params.post
    // };
    // Set locals
    // locals.section = 'gallery';

    // Load the galleries by sortOrder
    // view.query('galleries', keystone.list('Gallery').model.find().sort('sortOrder'));

    // Render the view
    // view.render('gallery');

    view.on('init', function(next) {

        var q = keystone.list('ContentCategory').model.findOne({
            // state: 'published',
            slug: locals.section
        });
        // .where('slug', locals.section);
        // .where('state', 'published')
        // .where
        // .sort('-publishedDate')
        // .populate('author categories');

        // if (locals.data.category) {
        // q.where('categories').in([locals.data.category]);
        // }

        q.exec(function(err, category) {
            if (!category) {
                return res.status(404).send('Not found'); //.render('errors/404');
            }
            locals.data.contentcategory = category;
            keystone.list('ContentPage').model.find()
                .where('category', category.id)
                .exec(function(err2, pages) {
                	locals.data.pages = pages;
		            next(err);
                });
        });


    });

    view.render('contentcategory');
};

/**
 * This file contains the common middleware used by your routes.
 * 
 * Extend or replace these functions as your application requires.
 * 
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */

var _ = require('underscore'),
	keystone = require('keystone'),
	async = require('async');


/**
	Initialises the standard view locals
	
	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/

exports.initLocals = function(req, res, next) {
	
	var locals = res.locals;
	
	var categoryQuery = keystone.list('ContentCategory').model
				.find()
				.populate('pages')
				.sort('sortOrder');

	locals.navLinks = [
		{ label: 'Home',		key: 'home',		href: '/' },
		{ label: 'Blog',		key: 'blog',		href: '/blog' }
	];
	locals.user = req.user;
	
	categoryQuery.exec(function(err, categories) {
		if (err) {
			console.log('could not load categories');
		}
		locals.categories = categories.map(function(category){
			return {name: category.name, slug: category.slug};
		});
		async.eachSeries(categories, function(category, callback){
			keystone.list('ContentPage').model.find()
				.where('category', category.id)
				.where('state', 'published')
				.sort('sortOrder')
				.exec(function(err2, pages) {
					var innerLinks;
					if(!pages || pages.length <= 0){
						callback(err2);
						return;
					}
					innerLinks = pages.map(function(page){
						return {label: page.title, key: category.slug + '/' + page.slug, href: '/' + category.slug + '/' + page.slug};
					});
					locals.navLinks.push({label: category.name, key: category.slug, href: (pages.length === 1 ? innerLinks[0].href : innerLinks), isSubmenu: pages.length > 1 });
					callback(err2);
				});
		}, function(err){	
			locals.navLinks.push({ label: 'Gallery',		key: 'gallery',		href: '/gallery' },
				{ label: 'Contact',		key: 'contact',		href: '/contact' });
			next(err);
		});
	});
	
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/

exports.flashMessages = function(req, res, next) {
	
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};
	
	res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length; }) ? flashMessages : false;
	
	next();
	
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function(req, res, next) {
	
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
	
};

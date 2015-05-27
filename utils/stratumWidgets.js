var keystone = require('keystone'),
	request = require('request'),
	async = require('async'),
	_ = require('underscore'),
	url = 'http://demo.registercentrum.se/widgets';

//!! Only run this after model initialization !!
exports.load = function(callback) {
	var StratumWidget = keystone.list('StratumWidget'),
		context = {
			nNew: 0,
			nRemoved: 0
		};

	async.series({
		requestWidgets: function(next) {
			request({
				url: url,
				json: true
			}, function(err, res, body) {
				context.widgets = body.data || [];
				next(err);
			});
		},
		processWidgets: function(next) {
			async.each(context.widgets, function(widget, cb) {
				StratumWidget.model.findOne({
					widgetSlug: widget.WidgetSlug
				}, function(err, doc) {
					var widgetModel;
					if (err) {
						cb(err);
					} else {
						if (!doc) {
							context.nNew++;
						}
						widgetModel = doc || new StratumWidget.model();
						widgetModel.widgetSlug = widget.WidgetSlug;
						widgetModel.pageId = widget.PageID;
						widgetModel.description = widget.Description;
						widgetModel.removed = false;
						widgetModel.save(cb);
					}
				});
			}, next);
		},
		findRemovedWidgets: function(next) {
			StratumWidget.model.find()
				.where('widgetSlug')
				.nin(_.pluck(context.widgets, 'WidgetSlug'))
				.exec(function(err, widgets) {
					context.removedWidgets = widgets;
					next(err);
				});
		},
		tagRemovedWidgets: function(next) {
			async.each(context.removedWidgets, function(widget, cb) {
				context.nRemoved++;
				widget.removed = true;
				widget.save(cb);
			}, next);
		}
	}, function(err) {
		if(!_.isFunction(callback)){
			return err;
		}
		return callback(err, context);
		// console.log('Removed: %d, New widgets: %d', context.nRemoved, context.nNew);
	});
};

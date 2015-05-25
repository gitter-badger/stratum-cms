var keystone = require('keystone'),
	StratumWidget = keystone.list('StratumWidget'),
	request = require('request'),
	async = require('async'),
	url = 'http://demo.registercentrum.se/widgets';

request({
	url: url,
	json: true
}, function(err, res, body) {
	var data;
	if (err) {
		console.log(err);
	} else if (body && body.success) {
		async.each(body.data || [], function(widget, cb) {
			var widgetModel;
			StratumWidget.model.findOne({
				widgetSlug: widget.WidgetSlug
			}, function(err, doc) {
				if (err) {
					cb(err);
				} else {
					widgetModel = doc || new StratumWidget.model();
					widgetModel.widgetSlug = widget.WidgetSlug;
					widgetModel.pageId = widget.PageID;
					widgetModel.description = widget.Description;
					widgetModel.save(cb);
				}
			});
		}, function(err) {
			if (err) { 
				console.log(err);
			} else {
				console.log('Imported all widgets');
			}
		});
	}
});

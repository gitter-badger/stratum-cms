var widget = require('../../utils/stratumWidgets');

exports = module.exports = function(req, res) {
	widget.load(function(err, context) {
		if (err) {
			return res.apiResponse({
				sucess: false,
				err: err
			});
		} else {
			return res.apiResponse({
				success: true,
				data: {
					removed: context.nRemoved,
					new: context.nNew
				}
			});
		}
	});
};

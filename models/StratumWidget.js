var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Stratum Widget Model
 * ==========
 *
 *
 */

var StratumWidget = new keystone.List('StratumWidget', {
	nocreate: true,
	noedit: true,
	nodelete: true,
	map: {
		name: 'widgetSlug'
	},
	autokey: {
		from: 'widgetSlug',
		path: 'slug',
		unique: true
	}
});

StratumWidget.add({
	widgetSlug: {
		type: String
	},
	pageId: {
		type: String
	},
	description: {
		type: String
	},
	removed: {
		type: Boolean
	}
});
StratumWidget.schema.virtual('register').get(function() {
	//Parse out the first characters before the slash as a register short name
	var match = /^([A-Za-z0-9]+)\/[A-Za-z0-9]+$/.exec(this.widgetSlug);
	return match && match[1];
});
StratumWidget.schema.virtual('url').get(function() {
	return 'http://stratum.registercentrum.se/widgets/' + this.widgetSlug;
});
StratumWidget.defaultColumns = 'widgetSlug, description';
StratumWidget.defaultSort = 'widgetSlug';
// StratumWidget.path = 'widgetSlug';

StratumWidget.register();

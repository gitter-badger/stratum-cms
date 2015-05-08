var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Content Category Model
 * ==========
 * Should probably find a better name for this instance
 * Models which categories should be seen in the root level menu
 */

var ContentCategory = new keystone.List('ContentCategory', {
	autokey: { from: 'name', path: 'slug', unique: true }
});

ContentCategory.add({
	name: {type: String, required: true },
	description: {type: Types.Textarea, height: 150 },
	registerSpecific: { type: Boolean, note: 'Only visible to logged in users'}
});
ContentCategory.relationship({path: 'pages', ref: 'ContentPage', refPath: 'category'});

ContentCategory.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});

ContentCategory.register();

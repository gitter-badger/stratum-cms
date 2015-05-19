var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * NewsItem Model
 * ==========
 */

var NewsItem = new keystone.List('NewsItem', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	plural: 'News'
});

NewsItem.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	subtitle: { type: String },
	image: { type: Types.CloudinaryImage },
	content: {
		lead: { type: Types.Textarea, height: 150 },
		brief: { type: Types.Textarea, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 }
	}
	// categories: { type: Types.Relationship, ref: 'NewsItemCategory', many: true }
});

NewsItem.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});

NewsItem.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
NewsItem.register();

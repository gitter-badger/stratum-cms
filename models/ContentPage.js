var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Content Page Model
 * ==========
 */

var ContentPage = new keystone.List('ContentPage', {
	sortable: true,
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

ContentPage.add({
	title: { type: String, required: true },
	category: { type: Types.Relationship, ref: 'ContentCategory', many: false },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	// author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	subtitle: { type: String },
	image: { type: Types.CloudinaryImage },
	widget: { type: Types.Relationship, ref: 'StratumWidget', many: false },
	content: {
		brief: { type: Types.Textarea, height: 150, hidden: true },
		extended: { type: Types.Html, wysiwyg: true, height: 400, hidden: true },
		markdown: { label: 'Content Markdown', type: Types.Markdown, height: 400, toolbarOptions: { hiddenButtons: 'H1,H6,Code' } },
		wysiwyg: { type: Types.Html, height: 400, wysiwyg: true }
	}
});

ContentPage.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});
 
// ContentPage.defaultSort = 'category';
ContentPage.defaultColumns = 'title, state|20%, category|20%, publishedDate|20%';
ContentPage.register();

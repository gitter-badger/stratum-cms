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
	images: { note: 'Add images which should be placed inline.', type: Types.CloudinaryImages },
	content: {
		brief: { type: Types.Textarea, height: 150, hidden: true },
		extended: { type: Types.Html, wysiwyg: true, height: 400, hidden: true },
		markdown: { label: 'Content Markdown', type: Types.Markdown, height: 400, toolbarOptions: { hiddenButtons: 'H1,H6,Code' } },
		wysiwyg: { type: Types.Html, height: 400, wysiwyg: true }
	}
});

//TODO: Exception handling!
//TODO: Cloudinary url
ContentPage.schema.pre('save', function(next){
	var imageRegEx = /\$\{bild([0-9]+)\}/g,
		matches = imageRegEx.exec(this.content.markdown.md),
		newMd = '',
		nextSub = 0,
		images = this.images.length,
		imageArr = [], i;
		while(matches){
			i = parseInt(matches[1], 10) - 1;
			if(i < images){
				imageArr.push(this.images[i].url);
				newMd += this.content.markdown.md.substr(nextSub, imageRegEx.lastIndex - nextSub - matches[0].length);
				newMd += '![desc](' + this.images[i].url + ' "title")';
				nextSub = imageRegEx.lastIndex;
			}
			matches = imageRegEx.exec(this.content.markdown.md);
		}
	newMd += this.content.markdown.md.substr(nextSub);
	// console.log(newMd);
	// console.log(imageArr);
	this.content.markdown.md = newMd;
	next();
});

ContentPage.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});
 
// ContentPage.defaultSort = 'category';
ContentPage.defaultColumns = 'title, state|20%, category|20%, publishedDate|20%';
ContentPage.register();

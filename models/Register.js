var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Register Model
 * ==========
 */

var Register = new keystone.List('Register', {
	map: { name: 'shortName' },
	autokey: { path: 'slug', from: 'shortName', unique: true },
	// nocreate: true,
	nodelete: true
});

Register.add({
	shortName: { type: String, required: true },
	name: {type: String },
	description: {type: Types.Textarea, height: 150 }
});

Register.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});

Register.register();

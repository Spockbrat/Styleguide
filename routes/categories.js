var _ = require('lodash'),
	express = require('express'),
	fs = require('fs'),
	path = require('path'),
	jf = require('jsonfile'),
	configPath = path.join('./', 'styleguide', 'config.txt'),
	config = JSON.parse(fs.readFileSync(configPath, 'utf8')),
	router = express.Router();

router.get('/', function(req, res) {
	var categories = JSON.parse(fs.readFileSync(config.categories, 'utf8'));

	res.json(categories);
});

router.post('/', function (req, res) {
	var categories = JSON.parse(fs.readFileSync(config.categories, 'utf8')),
		uniqueIds = _.map(categories, 'id'),
		newCategory = {},
		id = 1;

	uniqueIds.sort(function (a, b) {
		return a - b;
	});

	if (uniqueIds.length) {
		id = uniqueIds[uniqueIds.length - 1 ] + 1;
	}

	newCategory = {
		id: id,
		name: req.body.name
	};

	categories.push(newCategory);

	jf.writeFileSync(config.categories, categories);
	jf.writeFileSync(path.join(config.database, newCategory.name + config.extension), []);

	res.json(newCategory);
});

router.put('/:id', function(req, res) {
	var categories = JSON.parse(fs.readFileSync(config.categories, 'utf8')),
		uniqueIds = _.map(categories, 'id'),
		id = Number(req.params.id),
		categoryIndex = uniqueIds.indexOf(id),
		category = categories[categoryIndex],
		modifiedCategory;

	if (categoryIndex === -1) {
		res.json(false);
		return;
	}

	modifiedCategory = {
		id: id,
		name: req.body.name
	};

	categories.splice(categoryIndex, 1, modifiedCategory);
	jf.writeFileSync(config.categories, categories);

	res.json(modifiedCategory);
});

router.delete('/:id', function(req, res) {
	var categories = JSON.parse(fs.readFileSync(config.categories, 'utf8')),
		uniqueIds = _.map(categories, 'id'),
		id = Number(req.params.id)
		categoryIndex = uniqueIds.indexOf(id),
		category = categories[categoryIndex];

	if (categoryIndex === -1) {
		res.json(false);
		return;
	}

	categories.splice(categoryIndex, 1);

	jf.writeFileSync(config.categories, categories);
	res.json(category);
});

module.exports = router;
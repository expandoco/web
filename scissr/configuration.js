define(function (require) {
	var types = {
		string: require('types/string'),
		int: require('types/int'),
		float: require('types/float'),
		date: require('types/date'),
		bool: require('types/bool')
	};

	var generators = {
		json: require('generators/json'),
		xml: require('generators/xml'),
		csv: require('generators/csv'),
	};
	return {

		types: types,
		generators: generators
	};

});


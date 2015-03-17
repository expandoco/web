define(function () {
	function resolve(){

		var year = Math.floor((Math.random() * 2100 + 1000));
		var month = Math.floor((Math.random() * 13));
		var day = Math.floor((Math.random() * 29));

		var date = new Date(year,month,day);
		return date.toISOString();
	}
	return {
		name: "date",
		resolve: resolve
	}
});
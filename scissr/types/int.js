define(function () {
	function resolve(){
		var nr = Math.floor((Math.random() * 1000));
		return nr;
	}
	return {
		name: "int",
		resolve: resolve
	}
});
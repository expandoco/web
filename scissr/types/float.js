define(function () {
	function resolve(){
		var nr = (Math.random() * 1000);
		return nr;
	}
	return {
		name: "float",
		resolve: resolve
	}
});
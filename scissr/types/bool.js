define(function () {
	function resolve(){
		return !(Math.random()+.5|0);
	}
	return {
		name: "bool",
		resolve: resolve
	}
});
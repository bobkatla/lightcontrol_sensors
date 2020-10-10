var five = require("johnny-five");
var board = new five.Board();
const needle = require('needle');

board.on("ready", function() {
	// switch for light 0
	const s0 = new five.Sensor.Digital(7);
	const led0 = new five.Led(6);

	// switch for light 1
	const s1 = new five.Sensor.Digital(9);
	const led1 = new five.Led(8);
	// start to check
	s0.on("change", function() {
		if(this.value === 0) {
			led0.toggle();
		}
	});
	s1.on("change", function() {
		if(this.value === 0) {
			led1.toggle();
		}
	});
});
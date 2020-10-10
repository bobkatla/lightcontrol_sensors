var five = require("johnny-five");
var board = new five.Board();
const needle = require('needle');
const mqtt = require('mqtt');
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

// the topic is west area along with the topics of all the lights in this area
const topic_root = `/lightchange/west`;
const topic0 = topic_root + '/0';
const topic1 = topic_root + '/1';

client.on('connect', () => {
    client.subscribe([topic0, topic1]);
    console.log('mqtt connected');
});

board.on("ready", function() {
	const api = 'http://lightcontroller-280408594.us-east-1.elb.amazonaws.com:3000';
	// switch for light 0
	const s0 = new five.Sensor.Digital(7);
	const led0 = new five.Led(6);

	// switch for light 1
	const s1 = new five.Sensor.Digital(9);
	const led1 = new five.Led(8);

	// start to check

	client.on('message', (topic, message) => {
		if(topic.substring(topic_root.length+1)=== '0') {
			if (message.toString() === "true") {
				led0.on();
			} else {
				led0.off();
			}
		}
		if(topic.substring(topic_root.length+1)=== '1') {
			if (message.toString() === "true") {
				led1.on();
			} else {
				led1.off();
			}
		}
	});
	s0.on("change", function() {
		const data = {id : 0};
		if(this.value === 0) {
			//led0.toggle();
			needle('put', `${api}/switch`, data, {json: true})
			.then((res) => {
				console.log('message: ', res.body);
			}).catch((err) => {
				console.error(err);
			});
		}
	});
	s1.on("change", function() {
		const data = {id : 1};
		if(this.value === 0) {
			//led1.toggle();
			needle('put', `${api}/switch`, data, {json: true})
			.then((res) => {
				console.log('message: ', res.body);
			}).catch((err) => {
				console.error(err);
			});
		}
	});
});
int gps;

void setup() {
	Serial.begin(19200);
	Serial1.begin(9600);
}

void loop() {
	while (Serial1.available() > 0) {
		gps = Serial1.read();
		Serial.write(gps);
	}
}

//Import Libraries
#include "TinyGPSPlus.h"
#include <string.h>

//Host-Micro Protocol
#define micro_send (char)0b11110001
#define micro_end (char)0b11110010

#define gps_info (char)0b11000001
#define gps_na (char)0b11000010
#define gps_start (char)0b11000011

#define double_s sizeof(double)
#define uint_s sizeof(unsigned int)

// TinyGpsPlus
TinyGPSPlus gps;

// variables
double gps_lat;
double gps_lng;
unsigned int gps_upt = 0;

char uart_buf[(2*double_s)+uint_s];

// helper functions

// size in bytes
void send_UART(char type, char* buf = nullptr) {
	Serial.write(micro_send);
	Serial.write(type);
	if (buf != nullptr) {
		Serial.write(buf, sizeof(buf));
	}
	Serial.write(micro_end);
}

void setup() {
	// UART communication between host and arduino
	Serial.begin(19200);
	// GPS serial input
	Serial1.begin(9600);
	send_UART(gps_start);
}

void loop() {
	// retrieve gps if available
	while (Serial1.available() > 0) {
		gps.encode(Serial1.read());
	}
	if (gps.location.isUpdated()) {
		gps_lat = gps.location.lat();
		gps_lng = gps.location.lng();
		gps_upt++;
	}

	memcpy(uart_buf, &gps_lat, double_s);
	memcpy(uart_buf+double_s, &gps_lng, double_s);
	memcpy(uart_buf+(2*doube_s), &gps_upt, uint_s);

	if (gps.location.isValid()) {
		send_UART(gps_info, uart_buf);
	} else {
		send_UART(gps_na);
	}
}

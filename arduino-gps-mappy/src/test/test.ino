#include <string.h>

//Host-Micro Protocol
#define micro_send (char)0b11110001
#define micro_end (char)0b11110010

#define gps_info (char)0b11000001
#define gps_na (char)0b11000010
#define gps_start (char)0b11000011

#define double_s sizeof(double)
#define uint_s sizeof(unsigned int)

double gps_lat = 12.3456;
double gps_lng = 45.6789;
unsigned int gps_upt = 0;
char uart_buf[(2*double_s)+uint_s];


void send_UART(char type, char* buf = nullptr, size_t buf_size = 0) {
	Serial.write(micro_send);
	Serial.write(type);
	if (buf != nullptr) {
		Serial.write(buf, buf_size);
	}
	Serial.write(micro_end);
}

void setup() {
	Serial1.begin(9600);
	Serial.begin(19200);
	memcpy(uart_buf, &gps_lat, double_s);
	memcpy(uart_buf+double_s, &gps_lng, double_s);
	memcpy(uart_buf+(2*double_s), &gps_upt, uint_s);
	send_UART(gps_start);
}

void loop() {
	//if (Serial1.available() > 0) {
		//char gps = Serial1.read();
		//Serial.write(gps);
	//}
	
	send_UART(gps_info, uart_buf, sizeof(uart_buf));
	gps_upt++;
	memcpy(uart_buf+(2*double_s), &gps_upt, uint_s);

	delay(1000);
}


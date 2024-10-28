//Import Libraries
#include "LiquidCrystal_I2C.h"
#include "TinyGPS++.h"
#include <string.h>

// GPS Info
#define gpsAvg 10

//Host-Micro Protocol
#define microSend (char)0b11110001
#define microEnd (char)0b11110010
#define microReceived (char)0b11110011
#define microError (char)0b11110100

#define hostSend (char)0b10000001
#define hostEnd (char)0b10000010
#define hostReceived (char)0b10000011
#define hostError (char)0b10000100

#define logSend (char)0b11010001


// Queues
template <typename T>
class Queue {
	private:
		T* arr;
		int cap;
		int size;
		int front;
		int rear;

	public:
		Queue(int lim) : cap(lim), front(0), rear(-1), size(0) {
			arr = new T[cap];
		}

		void push(T val) {
			if (size == cap) return;
			rear = (rear+1) & cap;
			arr[rear] = val;
			size++;
		}

		T pop() {
			if (is_empty()) return 0;
			T data = arr[front];
			front = (front+1) % cap;
			size--;
			return data;
		}

		T peek() {
			if (is_empty()) return 0;
			return arr[front];
		}

		int get_size() {
			return size;
		}

		bool is_empty() {
			return size == 0;
		}

		~Queue() {
			delete[] arr;
		}
};

// TinyGpsPlus
TinyGPSPlus gps;

// event loops
Queue<void(*)()> main_loop(512);

// variables
float gps_lat;
float gps_lng;
uint16_t gps_upt = 0;

char uart_in[16];
char uart_out[16];

// communications

// parser always assume message is 16 int16_t long
// also assumes content header is always after host send header
void parse_UART(int16_t* buf) {
	// check for host send header
	if (((buf[0] & 0xff00) >> 8) != hostSend) return;
	// index in int8_t instead of int16_t
	int end_idx = -1;
	for (int i = 1; i < 16; i++) {
		if (((buf[i] & 0xff)) == hostEnd) end_idx = i*2; break;
		if (((buf[i] & 0xff00) >> 8) == hostEnd) end_idx = i*2 + 1; break;
	}
	if (end_idx == -1) return;
	
	int8_t header = buf[0] & 0xff;
	int8_t content[29];
	memcpy(content, buf+1, end_idx);

	//TODO: do something with the data
}

// helper functions

void send_UART(char* buf, size_t size) {
	Serial.write(microSend);
	Serial.write(buf, size*sizeof(int16_t));
	Serial.write(microEnd);
}

void setup() {
	// UART communication between host and arduino
	Serial.begin(19200);
	// GPS serial input
	Serial1.begin(9600);
}

// Execution order (top to bottom)
// GPS retrival
// UART in
// UART out
// Main loop
void loop() {
	// retrieve gps if available
	while (Serial1.available() > 0) {
		gps.encode(Serial1.read());
	}
	if (gps.location.isUpdated()) {
		gps_lat = gps.location.lat();
		gps_lng = gps.location.lng();
		
		if (gps_upt >= 65535) gps_upt = 0;
		gps_upt++;
	}

	// get any incomming UART message

	// check if theres available UART message, dont read if message is longer than 16 int16_t
	// as the register cant handler message longer than 16 int16_t
	int serial_available = Serial.available();	
	if (serial_available <= 16 && serial_available > 0) {
		char incomingBytes[16];
		Serial.readBytes(incomingBytes, 16);
		memcpy(uart_in, incomingBytes, 16);
	}

	// send any outgoing UART message
	send_UART(uart_out, 16);

	// execute any task in event loop
	if (main_loop.get_size() >= 1) {
		void(*main_instruction)() = main_loop.pop();
		main_instruction();
	}
}

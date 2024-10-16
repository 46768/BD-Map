CC = gcc
CXX = g++
CFLAGS = -W

SRC_DIR = ./src
LIB_DIR = ./lib
BUILD_DIR = ./build

$(BUILD_DIR)/astar.out : $(SRC_DIR)/main.cpp
	if [ ! -d $(BUILD_DIR) ]; then mkdir $(BUILD_DIR); fi
	$(CXX) $(CFLAGS) $^ -o $@

.PHONY: run clean
run :
	$(BUILD_DIR)/astar.out

clean :
	if [ -d $(BUILD_DIR) ]; then rm -r $(BUILD_DIR); fi

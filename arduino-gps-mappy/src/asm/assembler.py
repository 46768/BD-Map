import os

opcodeMapping = {
    "NOP": 0b0000,
    "ADD": 0b0001,
    "SUB": 0b0010,
    "MUL": 0b0011,
    "DIV": 0b0100,
    "MOV": 0b0101,
    "LDI": 0b0110,
    "NOP6": 0b0111,
    "JMP": 0b1000,
    "JZ": 0b1001,
    "JNZ": 0b1010,
    "JM": 0b1011,
    "JL": 0b1100,
    "NOP7": 0b1101,
    "NOP8": 0b1110,
    "HALT": 0b1111,
}

registerCount = 64
asmFunctionsPath = "./asmFunctions"
asmAssmbledPath = "./asmAssembled"

asmFunctionsFiles = [f for f in os.listdir(asmFunctionsPath) if os.path.isfile(
    os.path.join(asmFunctionsPath, f)
)]
registerMapping = {}
for i in range(registerCount):
    registerMapping[f'r{i}'] = i

if (not os.path.exists(asmAssmbledPath)):
    os.mkdir(asmAssmbledPath)

for fileName in asmFunctionsFiles:
    machineCode = []
    file = open(fileName, "r")
    assembledFile = open(
        asmAssmbledPath.join("/", fileName.split('.')[0]),
        "w"
    )
    lines = (line.strip() for line in file)
    # remove comments
    lines = [line.split(';')[0] for line in lines]
    # remove blank lines
    lines = [line for line in lines if line.strip()]

    instruction = [words.split() for words in lines]
    for words in instruction:
        if opcodeMapping.get(words[0]) is None:
            exit(f'could not parse opcode {words[0]}')
        opcode = opcodeMapping[words[0]]
        if (opcode in ["HALT", "JZ", "JNZ", "NOP"] and len(words) != 1):
            exit(f'invalid operand count for {opcode}')
        if (opcode in [] and len(words) != 1):
            exit(f'invalid operand count for {opcode}')
        if (opcode in

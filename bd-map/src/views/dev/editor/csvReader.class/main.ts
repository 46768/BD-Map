export class CSVReader<T> {
	fileReader: FileReader = new FileReader()
	postProcessingFn: Function = (a: any) => a
	inputElement?: HTMLInputElement
	
	constructor(postProcess?: (s: string[][]) => T) {
		if (postProcess) this.postProcessingFn = postProcess
	}

	attachElement(el: HTMLInputElement) {
		this.inputElement = el
	}

	clearInput() {
		if (this.inputElement) this.inputElement.value = ""
	}

	readFile(): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			if (this.inputElement) {
				if (this.inputElement.files && this.inputElement.files.length > 0) {
					this.fileReader.onload = async () => {
						const data = await this.boundedParseCSV()
						resolve(data)
					}
					this.fileReader.readAsText(this.inputElement.files[0])
				} else {
					//Input Type Not File
					reject("ITNF")
				}
			} else {
				//No File Input Element
				reject("NFIE")
			}
		})
	}

	detach() {
		this.fileReader.onload = null
	}

	boundedParseCSV: () => Promise<T> = () => this.parseCSV()

	parseCSV() {
		return new Promise<T>((resolve, reject) => {
			if (this.fileReader.result && typeof this.fileReader.result === 'string') {
				const csvData: string = this.fileReader.result
				const lineSplit: string[] = csvData.split('\n')
				//get rid of the empty string split from the last \n in the data
				lineSplit.pop()
				const fullCSVData: string[][] = lineSplit.map(line => line.split(','))
				resolve(this.postProcessingFn(fullCSVData))
			} else {
				console.error(`error parsing csv, expected string, got ${typeof this.fileReader.result}`)
				//Invalid Read Result Type
				reject("IRRT")
			}
		})
	}
}

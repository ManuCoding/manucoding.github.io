class neuralNetwork {
	constructor(
		input = 1, output = 1,
		neurons = 2,
		synapses = 1,
		mutation = [1, 1000]
	) {
		this.sInput = input, this.sOutput = output,
		this.neurons = new Array(neurons), this.synapses = new Array(synapses),
		this.mutation = mutation;
		
		this.initialize();
	}
	
	initialize() {
		for (let n = 0; n < this.neurons.length; n++) {
			this.neurons[n] = {type: random(0, 2), index: random(), value: negRnd()};
		}
		
		for (let s = 0; s < this.synapses.length; s++) {
			this.synapses[s] = {type: random(0, 4), input: new Array(2), output: random()};
			
			for (let i = 0; i < this.synapses[s].input.length; i++) {
				this.synapses[s].input[i] = random();
			}
		}
	}
	
	feed(inputs, outputs) {
		for (let n = 0; n < this.neurons.length; n++) {
			if (isNaN(this.neurons[n].value) || this.neurons[n].value == null || typeof this.neurons[n].value == 'undefined' || !isFinite(this.neurons[n].value)) {
				this.neurons[n].value = rnd();
			}
			
			if (this.neurons[n].type == 0) {
				this.neurons[n].value = inputs[inputs.id(this.neurons[n].index)];
			}
		}
		
		for (let s = 0; s < this.synapses.length; s++) {
			const index = this.neurons.id(this.synapses[s].output),
				value1 = this.neurons[this.neurons.id(this.synapses[s].input[0])].value,
				value2 = this.neurons[this.neurons.id(this.synapses[s].input[1])].value;
			
			switch (this.synapses[s].type) {
				case 0:
					this.neurons[index].value = (value1 - value2) || rnd();
					break;
				case 1:
					this.neurons[index].value = (value1 + value2) || rnd();
					break;
				case 2:
					this.neurons[index].value = (value1 * value2) || rnd();
					break;
				case 3:
					if (value2 != 0) {
						this.neurons[index].value = (value1 / value2) || rnd();
					}
					break;
				case 4:
					if (value2 != 0) {
						this.neurons[index].value = (value1 % value2) || rnd();
					}
					break;
				case 5:
					if (value1 >= 0 || value2 % 1 == 0) {
						this.neurons[index].value = Math.pow(value1, value2) || rnd();
					}
					break;
				case 6:
					if (value1 >= 0) {
						this.neurons[index].value = Math.sqrt(value1) || rnd();
					}
					break;
				case 7:
					if (value1 > 0 && value2 > 0) {
						this.neurons[index].value = Math.log(value1) / Math.log(value2) || rnd();
					}
					break;
			}
			
			if (isNaN(this.neurons[index].value) || this.neurons[index].value == null || typeof this.neurons[index].value == 'undefined' || !isFinite(this.neurons[index].value)) {
				this.neurons[index].value = rnd();
			}
		}
		
		for (let o = 0; o < outputs.length; o++) {
			for (let n = 0; n < this.neurons.length; n++) {
				if (this.neurons[n].type == 2 && outputs.id(this.neurons[n].index) == o) {
					outputs[o] += this.neurons[n].value;
				}
			}
			
			outputs[o] = sig(outputs[o]);
		}
		
		return outputs;
	}
	
	breed(female) {
		let child = new neuralNetwork(this.sInput, this.sOutput, Math.round((this.neurons.length + female.neurons.length) / 2), Math.round((this.synapses.length + female.synapses.length) / 2));
		
		for (let n = 0; n < child.neurons.length; n++) {
			if (this.neurons.length - 1 >= n && female.neurons.length - 1 >= n) {
				child.neurons[n].type = Math.round((this.neurons[n].type + female.neurons[n].type) / 2);
				child.neurons[n].index = Math.round((this.neurons[n].index + female.neurons[n].index) / 2);
				child.neurons[n].value = (this.neurons[n].value + female.neurons[n].value) / 2;
			} else {
				child.neurons[n] = this.neurons[n] || female.neurons[n];
			}
		}
		
		for (let s = 0; s < child.synapses.length; s++) {
			if (this.synapses.length - 1 >= s && female.synapses.length - 1 >= s) {
				child.synapses[s].type = Math.round((this.synapses[s].type + female.synapses[s].type) / 2);
				
				for (let i = 0; i < child.synapses[s].input; i++) {
					child.synapses[s].input[i] = Math.round((this.synapses[s].input[i] + female.synapses[s].input[i]) / 2);
				}
				
				child.synapses[s].output = Math.round((this.synapses[s].output + female.synapses[s].output) / 2);
			} else {
				child.synapses[s] = this.synapses[s] || female.synapses[s];
			}
		}
		
		return child;
	}
	
	blend(brain) {
		let blended = new neuralNetwork(this.sInput, this.sOutput, Math.round((this.neurons.length + brain.neurons.length) / 2), Math.round((this.synapses.length + brain.synapses.length) / 2));
		
		for (let n = 0; n < blended.neurons.length; n++) {
			if (this.neurons.length - 1 >= n && brain.neurons.length - 1 >= n) {
				blended.neurons[n] = (random() == 0) ? this.neurons[n] : brain.neurons[n];
			} else {
				blended.neurons[n] = this.neurons[n] || brain.neurons[n];
			}
		}
		
		for (let s = 0; s < blended.synapses.length; s++) {
			if (this.synapses.length - 1 >= s && brain.synapses.length - 1 >= s) {
				blended.synapses[s] = (random() == 0) ? this.synapses[s] : brain.synapses[s];
			} else {
				blended.synapses[s] = this.synapses[s] || brain.synapses[s];
			}
		}
		
		return blended;
	}
	
	mutate(mutation = this.mutation) {
		let mutated = new neuralNetwork(this.sInput, this.sOutput, this.neurons.length, this.synapses.length);
		
		let kink = random(mutation[0], mutation[1]);
		
		for (let n = 0; n < mutated.neurons.length; n++) {
			mutated.neurons[n].type = (random(0, kink) == 0) ? random(0, 2) : this.neurons[n].type;
			mutated.neurons[n].index = (random(0, kink) == 0) ? this.neurons[n].index + random(-1, 1) : this.neurons[n].index;
			mutated.neurons[n].value = (random(0, kink / 2) == 0) ? this.neurons[n].value + rnd(-0.5, 0.5) : this.neurons[n].value;
		}
		
		for (let s = 0; s < mutated.synapses.length; s++) {
			mutated.synapses[s].type = (random(0, kink * 2) == 0) ? cycle(this.synapses[s].type + random(-1, 1), 0, 4) : this.synapses[s].type;
			
			for (let i = 0; i < mutated.synapses[s].input.length; i++) {
				mutated.synapses[s].input[i] = (random(0, kink * 2) == 0) ? this.synapses[s].input[i] + random(-1, 1) : this.synapses[s].input[i];
			}
			
			mutated.synapses[s].output = (random(0, kink * 2) == 0) ? this.synapses[s].output + random(-1, 1) : this.synapses[s].output;
		}
		
		if (random(0, kink * 2) == 0 && mutated.neurons.length > 2) {
			mutated.neurons.splice(random(0, mutated.neurons.length - 1), 1);
		}
		
		if (random(0, kink * 2) == 0 && mutated.synapses.length > 1) {
			mutated.synapses.splice(random(0, mutated.synapses.length - 1), 1);
		}
		
		if (random(0, kink * 2) == 0) {
			mutated.neurons.push({type: random(0, 2), index: random(0, Math.max(mutated.sInput, mutated.sOutput) - 1), value: negRnd()});
		}
		
		if (random(0, kink * 2) == 0) {
			mutated.synapses.push({type: random(0, 4), input: new Array(2), output: random(0, mutated.neurons.length - 1)});
			
			for (let i = 0; i < mutated.synapses[mutated.synapses.length - 1].input.length; i++) {
				mutated.synapses[mutated.synapses.length - 1].input[i] = random(0, mutated.neurons.length - 1);
			}
		}
		
		return mutated;
	}
}

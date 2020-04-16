function evalBF(bfcode) {
	// Keep track when we should go back!
	var bracketPreviousPos=[];

	// Max stack length is 3000
	var stack=new Uint8Array(3000);
	var stackPointer=0;
	var bufferUsed=0;

	var out=false;
	// Loop through code (one command per milisecond)
	var pos=0;

	// Delete useless non-bf characters
	bfcode=bfcode.replace(/[^\[\]<>\+\-\,\.!]+/g,"");
	// Counting the number of iterations
	var iterations=0;
	const interval=setInterval(() => {
		if(waitingForInput) return null;
		if(receivedInput) {
			stack[stackPointer]=inputChr.charCodeAt();
			receivedInput=false;
		}
		switch(bfcode[pos]) {
			case "[":
			bracketPreviousPos.push(pos);
			break;
			case "]":
			if(bracketPreviousPos.length) {
				// Come back to previous matching bracket if non-zero cell
				if(stack[stackPointer]) pos=bracketPreviousPos[bracketPreviousPos.length-1]
				else bracketPreviousPos.pop();
			} else {
				throw -100;
			}
			break;
			case ">":
			if(stackPointer++>=stack.length) {
				throw -10;
			}
			if(stackPointer>=bufferUsed) bufferUsed=stackPointer;
			break;
			case "<":
			if(stackPointer) {
				stackPointer--;
			} else {
				throw -50;
			}
			break;
			case "+":
			stack[stackPointer]++;
			break;
			case "-":
			stack[stackPointer]--;
			break;
			case ",":
			stack[stackPointer]=input().charCodeAt(0);
			break;
			case ".":
			output(String.fromCharCode(stack[stackPointer]));
			break;
			case "!":
			out=true;
		}
		if(pos++>=bfcode.length) out=true;
		if(out) {
			// Do something with iterations...
			// Do something with total memory buffer used...

			// ...and clear the interval
			clearInterval(interval);
			console.log("Done!");
		}
		iterations++;
	},1);
}

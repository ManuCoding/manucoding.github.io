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
	const interval=setInterval(() => {
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
				throw new Error("Cannot find matching opening bracket!");
			}
			break;
			case ">":
			if(stackPointer++>=stack.length) {
				throw new Error("Data pointer exceded maximum memory allowed!");
			}
			if(stackPointer>=bufferUsed) bufferUsed=stackPointer;
			break;
			case "<":
			if(stackPointer) {
				stackPointer--;
			} else {
				throw new Error("Data pointer passed zero!");
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
			case "!":
			out=true;
		}
		if(pos++>=bfcode.length) out=true;
		if(out) {
			clearInterval(interval);
		}
	},1);
}

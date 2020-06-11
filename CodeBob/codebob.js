(function(global,factory) {
	global.CodeBob=factory();
})(this,function() {
	const version="1.0.0";
	function $text(text) {
		return document.createTextNode(text);
	}
	function $el(tagName,className="",children=[],options={}) {
		var el=document.createElement(tagName);
		if(className) el.className=className.replace("."," ");
		el.attr=el.setAttribute;
		el.remove=el.removeAttribute;
		el.has=el.hasAttribute;
		el.add=el.appendChild;
		el.addDown=(f) => el.addEventListener("mousedown",f);
		for(var child of children) {
			el.add(child);
		}
		copyTo(options,el);
		return el;
	}
	function defaultChildSet() {
		return {
			measure:$el("cb-measure",0,[$text("x")]),
			scroll:{
				tag:"cb-scroll",
				c:{
					display:{
						tag:"cb-display",
						c:{
							selection:$el("cb-selects"),
							cursors:$el("cb-cursors"),
							gutters:$el("cb-gutters"),
							lines:$el("cb-lines")
						}
					}
				}
			},
			default:[
				// test()
			]
		};
	}
	// function test() {
	// 	return $el("cb-test",0,[$text("testing...")]);
	// }
	function copyTo(a,b) {
		for(var option in a) {
			b[option]=a[option];
		}
	}
	function getChildSet(childSet,editorNodes={}) {
		if(childSet instanceof Array) return childSet;
		var children=[];

		for(var option in childSet) {
			var child=childSet[option],el;
			if(typeof child=="string") {
				el=$el(child);
			} else if(child instanceof Node) {
				el=child;
			} else if(child instanceof Array) {
				child.forEach(el => {
					children.push(el);
				});
			} else if(typeof child=="object") {
				el=child.isText ? $text(child.text || "") : $el(child.tag || "div",child.cls,child.c ? getChildSet(child.c,editorNodes) : []);
			} else {
				// debugger;
			}
			if(el) {
				editorNodes[option]=el;
				children.push(el);
			}
		}
		return children;
	}
	function set(attr,val) {
		CodeBob[attr]=val;
	}

	var userDefaults={};
	function getDefaultOptions() {
		var defaultOptions={
			mode:"plain",
			lineNumbers:false,
			autofocus:false
		}
		copyTo(userDefaults,defaultOptions);
		return defaultOptions;
	}


	(function(global,factory) {
		global.cb=factory();
	})(this,function() {
		function builder(el,options,$this) {
			var editorNodes={};
			this.elements={};
			var main=$el("codebob-editor","",getChildSet(defaultChildSet(),editorNodes));
			this.elements.main=main;
			el.appendChild(this.elements.main);
			this.options=getDefaultOptions();
			copyTo(options,this.options);
			copyTo(editorNodes,this.elements);

			if(typeof this.options.theme=="string" || this.options.theme instanceof Array) {
				typeof this.options.theme=="string" ? this.options.theme=this.options.theme.replace(/[,\.]+/," ").trim().split(" ") : null;
				for(var theme of this.options.theme) {
					main.classList.add(theme);
				}
				this.options.theme=this.options.theme.length==1 ? this.options.theme[0] : this.options.theme.length ? this.options.theme : "";
			}

			var content=this.options.content || "";
			this.lines=[];
			for(var line of content.split("\n")) this.elements.lines.add(this.lines[this.lines.push(newLine(line))-1].element);
			function newLine(text) {
				var lineEl=$el("cb-line");
				lineEl.innerText=text;
				return {
					content:text,
					showText:text,
					element:lineEl,
					getText(cursors) {
						if(!mainTextarea.value) return this.content;
						var resultString="",
						startPos=0;
						// Cursors are supposed to be in order on that specific line
						for(var cursor of cursors) {
							resultString+=this.content.slice(startPos,cursor.col)+mainTextarea.value;
							startPos=cursor.col;
						}
						return resultString+this.content.slice(startPos,this.content.length);
					}
				}
			}

			function updateText($this) {
				if(!mainTextarea.value) return;
				var lastLine=0,
				usingCursors=[];
				for(var cursor of Array.prototype.concat($this.cursors,[{line:-1}])) {
					if(cursor.line==lastLine) {
						usingCursors.push(cursor);
					} else {
						if(usingCursors.length) {
							var text=$this.lines[lastLine].getText(usingCursors);
							$this.lines[lastLine].showText=text;
							$this.lines[lastLine].element.innerText=text;
						}
						lastLine=cursor.line;
						usingCursors=[cursor];
					}
				}
				mainTextarea.value="";
			}
			function appendText($this) {
				if(!mainTextarea.value) return;
				updateText($this);
				for(var line of $this.lines) {
					line.content=line.showText;
				}
				mainTextarea.value="";
			}

			var measureElement=this.elements.measure;
			function getMeasure() {
				return measureElement.getBoundingClientRect();
			}
			function getContent() {
				var lines=[];
				for(var line of this.lines) lines.push(line.text);
				return lines.join("\n");
			}

			var mainTextarea=$el("textarea","",[],{style:"position: absolute; opacity: 0; width: 3px; border: 0px; resize: none;",lines:1});
			main.addDown((e) => {
				mainTextarea.focus();
				e.preventDefault();
			});
			var cursorContainer=this.elements.cursors;
			this.cursors=[cursor(0,0,0,0)];
			function cursor(line,col,displayX,displayY) {
				var curEl=$el("cb-cursor");
				curEl.innerHTML="&#8203;"
				cursorContainer.add(curEl);
				if(!cursorContainer.querySelector("textarea")) {
					cursorContainer.add(mainTextarea);
				}
				var $this=this;
				return new function() {
					this.line=line;
					this.col=col;
					// To use later...
					this.memoryCol=col;
					this.screenX=displayX;
					this.screenY=displayY;
					this.curEl=curEl;
					this.move=function() {
						var measure=getMeasure();
						this.curEl.style.height=measure.height;
						this.screenX=(this.col+mainTextarea.value.length)*measure.width;
						this.screenY=this.line*measure.height;
						// Maybe some more calculations...

						// Using Math.floor to get integer position
						this.curEl.style.transform="translate("+Math.floor(this.screenX)+"px,"+Math.floor(this.screenY)+"px)";
					}
					this.moveRL=function(dir) {
						if(dir>0 || (typeof dir=="string" && dir.toLowerCase()=="right")) {
							this.col++;
						} else {
							if(this.col>0) this.col--;
						}
						this.memoryCol=this.col;
					}
					this.moveUD=function(dir) {
						if(dir>0 || (typeof dir=="string" && dir.toLowerCase()=="down")) {
							this.line++;
						} else {
							if(this.line>0) this.line--;
						}
					}
				}
			}

			this.elements.gutters.add($el("cb-gutter","",[],{innerHTML:"&#8203;"}));

			var forceFocus=!!this.options.autofocus;

			// For debugging...
			mainTextarea.style="position: absolute; bottom: 0px; right: 0px; width: 50%;";

			// Handle key events
			(function(global,toExec) {
				toExec(global);
			})(this,function($this) {
				mainTextarea.addEventListener("keydown",(key) => {
					// console.log(key.keyCode);
					var moving=false;
					switch(key.keyCode) {
						case 37:
						case 38:
						case 39:
						case 40:
						appendText($this);
						moving=true;
						key.preventDefault();
					}
					for(var cursor of $this.cursors) {
						if(moving) key.keyCode%2 ? cursor.moveRL(key.keyCode==37 ? "left" : "right") : cursor.moveUD(key.keyCode==38 ? "up" : "down");
						cursor.move();
					}
				});
			});

			var mainLoopId;
			this.pause=function() {
				if(mainLoopId) clearInterval(mainLoopId);
				var _mainLoopId=mainLoopId;
				mainLoopId=null;
				return _mainLoopId;
			}
			this.resetLoop=function() {
				this.pause();
				var $this=this;
				mainLoopId=setInterval(editorLoop,1);
			}
			this.resetLoop();
			function editorLoop() {
				var hasLineNumbers;
				if((hasLineNumbers=$this.options.lineNumbers)!=main.has("line-numbers")) {
					hasLineNumbers ? main.attr("line-numbers","") : main.remove("line-numbers");
				}
				var hasFocus;
				if((hasFocus=(main.querySelector("*:focus")!=null) || forceFocus)!=main.has("focused")) {
					hasFocus ? main.attr("focused","") : main.remove("focused");
					forceFocus=false;
				}
				if(hasFocus) mainTextarea.focus();
				// $this.elements.lines.innerText=mainTextarea.value;
			}

			copyTo(this,$this);
		}
		function CodeBob(el=document.body,options={}) {
			builder.call(CodeBob,el,options,this);
		}
		return CodeBob;
	});
	function CodeBob(el,options) {
		// CodeBob Editor Version 1.0.0

		return new cb(el,options);
	}
	set("fromTextArea",(textarea,options={}) => {
		var parent=textarea.parentElement;
		if(!parent) return null;
		textarea.style.display="none";
		options.content=options.content || textarea.value;
		if(textarea.autofocus) {
			options.autofocus=true;
		}
		var editor=new cb(parent,options);
		parent.insertBefore(editor.elements.main,textarea.nextElementSibling);
		return editor;
	});
	set("version",version);
	set("setDefault",(option,defaultValue) => userDefaults[option]=defaultValue);

	return CodeBob;
});

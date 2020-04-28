(function(global) {
	var doc=document.documentElement,
	canvas=document.getElementById("canvas"),
	ctx=canvas.getContext("2d");
	var library;
	function resize(width,height) {
		[global.width,global.height]=[width,height];
		[library.width,library.height]=[width,height];
		[canvas.width,canvas.height]=[width,height];
	}
	var toLoad=0,
	loaded=0;
	function hex(n) {
		return (n=n%256)<16 ? "0"+n.toString(16) : n.toString(16);
	}
	for(var thing in library={
		width:0,
		height:0,
		fill(r,g,b,a) {
			if(!isNaN(r) && !isNaN(g) && !isNaN(b) && !isNaN(a)) return ctx.fillStyle=`#${hex(r)}${hex(g)}${hex(b)}${hex(a)}`;
			if(!isNaN(r) && !isNaN(g) && !isNaN(b)) return ctx.fillStyle=`#${hex(r)}${hex(g)}${hex(b)}`;
			if(!isNaN(r) && !isNaN(g)) return ctx.fillStyle=`#${hex(r)}${hex(r)}${hex(r)}${hex(g)}`;
			if(!isNaN(r)) return ctx.fillStyle=`#${hex(r)}${hex(r)}${hex(r)}`;
			return ctx.fillStyle=r;
		},
		rect(x,y,w,h) {
			ctx.fillRect(x,y,w,h);
		},
		background(r,g,b,a) {
			var fill=ctx.fillStyle;
			document.body.style.background=library.fill(r,g,b,a);
			library.rect(0,0,canvas.width,canvas.height);
			return library.fill(fill);
		},
		loadImage(src) {
			var img=new Image(src);
			toLoad++;
			img.onload=function() {
				img.ready=true;
				loaded++;
			};
			img.ready=false;
			img.src=src;
			return img;
		}
	}) global[thing]=library[thing];
	var frame=global.requestAnimationFrame;
	var errorCount=0;
	function draw() {
		if(doc.clientWidth!=global.width || doc.clientHeight!=global.height) resize(doc.clientWidth,doc.clientHeight);
		try {
			typeof global.draw=="function" ? global.draw() : null;
		} catch(e) {
			if(errorCount<20) console.error(e);
			errorCount++;
		}
		if(errorCount<100) frame(draw);
	}
	draw();
})(this);

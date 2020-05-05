(function(global) {
	var doc=document.documentElement,
	canvas=document.getElementById("canvas"),
	ctx=canvas.getContext("2d");
	var library;
	function resize(width,height) {
		[global.width,global.height]=[width,height];
		[library.width,library.height]=[width,height];
		[canvas.width,canvas.height]=[width,height];
		typeof global.onresize=="function" ? global.onresize(width,height) : null;
	}
	var toLoad=0,
	loaded=0;
	function hex(n) {
		return (n=n%256)<16 ? "0"+n.toString(16) : n.toString(16);
	}
	for(var thing in Math) global[thing]=Math[thing];
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
		cut(x,y,w,h) {
			ctx.clearRect(x,y,w,h);
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
				img.loaded=true;
				loaded++;
			};
			img.loaded=false;
			img.src=src;
			return img;
		},
		image(img,dx,dy,dw,dh,sx,sy,sw,sh) {
			var i=ctx.drawImage;
			return img ? (img.loaded || img instanceof Image) ? null : isNaN(sh) ? isNaN(dh) ? (isNaN(dx) || isNaN(dy)) ? null : i(img,dx,dy) : i(img,dx,dy,dw,dh) : i(img,sx,sy,sw,sh,dx,dy,dw,dh) : null;
		},
		rnd(min=0,max=1,digits=0) {
			digits=Math.pow(10,digits);
			min*=digits;
			nbr=Math.floor(Math.random()*(max*digits-min+1)+min);
			return nbr/digits;
		},
		mouse:{
			x:0,
			y:0,
			px:0,
			py:0,
			down:false
		},
		click(id,onclick) {
			document.getElementById(id).onclick=onclick;
		}
	}) global[thing]=library[thing];
	var frame=global.requestAnimationFrame;
	var errorCount=0;
	["down","move","up"].forEach((evt) => {
		document.addEventListener("mouse"+evt,(e) => {
			mouse.px=mouse.x;
			mouse.py=mouse.y;
			mouse.x=e.pageX;
			mouse.y=e.pageY;
			mouse.down=!!(e.buttons%2);
			var f=global[e.type];
			typeof f=="function" ? f(e) : null;
		},false);
	});
	["down","up"].forEach((evt) => {
		document.addEventListener("key"+evt,(key) => {
			var f=global[key.type];
			typeof f=="function" ? f(key) : null;
		},false);
	});
	function draw() {
		if(doc.clientWidth!=global.width || doc.clientHeight!=global.height) resize(doc.clientWidth,doc.clientHeight);
		try {
			if(toLoad<=loaded) typeof global.draw=="function" ? global.draw() : null;
		} catch(e) {
			if(errorCount<20) console.error(e);
			errorCount++;
		}
		if(errorCount<100) frame(draw);
	}
	resize(doc.clientWidth,doc.clientHeight);
	draw();
})(this);

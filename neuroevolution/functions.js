/* Transforms a number into the possible indexes of an array */
Array.prototype.id=function(i){return cycle(i, 0, this.length - 1);}

/* Limits a number according to boundaries by clamping */
function range(nbr,min,max){if(nbr<min){return min;}else if(nbr>max){return max;}else{return nbr;}}
/* Limits a number to boundaries, but with cycle */
function cycle(nbr,min,max){let r=max-min;if(nbr<min){return nbr+Math.floor((min-nbr)/r)*r;}if(nbr>max){return nbr-Math.ceil((nbr-max)/r)*r;}return nbr;}

/* Generate a random number between min, and max with decimal places option */
function random(min=0,max=1,digits=0){digits=Math.pow(10,digits);min*=digits;nbr=Math.floor(Math.random()*(max*digits-min+1)+min);return nbr/digits;}
/* Generate a random number between min, and max with all the decimal places */
function rnd(min=0,max=1){return Math.random()*(max-min)+min;}
/* Generate a random number between -limits, and limits with all the decimal places */
function negRnd(limits=1){return (Math.random()*2-1)*limits;}

/* Compute the sigmoid mathematical function */
function sig(nbr){return 1/(1+Math.pow(Math.E,-nbr));}

/* Returns the element with the maximum value of parameter a in the array of objetcs */
Array.prototype.hasMin=function(a){return(this.length&&this.reduce(function(p,c){return p[a]<c[a]?p:c;}))||null;}
/* Returns the element with the minimum value of parameter a in the array of objetcs */
Array.prototype.hasMax=function(a){return(this.length&&this.reduce(function(p,c){return p[a]>c[a]?p:c;}))||null;}

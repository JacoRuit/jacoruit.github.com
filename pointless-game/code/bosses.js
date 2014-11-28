kitty.Boss = function(gv){};
kitty.Boss.prototype.onClick = function(){};
kitty.Boss.prototype.hasEnded = function(){};
kitty.Boss.prototype.hasWon = function(){};
kitty.Boss.prototype.onEnd = function(){};
kitty.Boss.prototype.update = function(delta){};
kitty.Boss.prototype.render = function(){};


kitty.GABE_UPTIME = 50;
kitty.GABE_W = 500;
kitty.GABE_H = 537;
kitty.GABE_SHOT_TIME = 0.5;

kitty.Gabe = function(gv){
	this.gv = gv;
	this.time = 0;
	this.moneyLeft = 10000;
	this.shots = [];
	this.shotDelta = 0;
	this.pos = {x: kitty.WIDTH / 2 - kitty.GABE_W / 2, y: kitty.HEIGHT / 2 - kitty.GABE_H / 2};
	this.mouthX = 98;
	this.mouthY = this.mouthUY = 190;
	this.mouthBY = 218;
	this.up = false;
	this.gv.canvas.addLayer({
		name: "gabe_box_text",
		type: "text",
		text: "",
		fillStyle: "black",
		fontSize: "20px",
		align: "left",
		x: kitty.WIDTH - 140, y: 10,
		maxWidth: 140,
		fromCenter: false
	});
	this.boxTextLayer = this.gv.canvas.getLayer("gabe_box_text");
};

kitty.Gabe.prototype = new kitty.Boss();
kitty.Gabe.constructor = kitty.Gabe;

kitty.Gabe.prototype.onClick = function(){
	var mouse = this.gv.mousePos;
	var hitI = null;
	for(var i = this.shots.length - 1; i > -1; --i){
		var shot = this.shots[i];
		var sx = shot.pos.x - shot.w / 2;
		var sy = shot.pos.y - shot.h / 2;
		if(mouse.x >= sx && mouse.y >= sy && mouse.x <= sx + shot.w && mouse.y <= sy + shot.h){
			this.moneyLeft -= 100 - shot.percent;
			hitI = i;
			break;
		}
	}
	if(hitI != null) this.shots.splice(hitI, 1);
};

kitty.Gabe.prototype.hasEnded = function(){
	return this.time >= kitty.GABE_UPTIME * 1000 || this.moneyLeft < 1;
};

kitty.Gabe.prototype.hasWon = function(){
	return this.moneyLeft < 1;
};

kitty.Gabe.prototype.onEnd = function(){
	var points = Math.round(this.moneyLeft / 100);
	this.gv.game.score += points;
	this.gv.displayInfo("Gabe +" + points + " :D:D");
};

kitty.Gabe.prototype.update = function(delta){
	this.shotDelta += delta;
	this.time += delta;
	var delI = null;
	for(var i = 0; i < this.shots.length; ++i){
		var shot = this.shots[i];
		if(shot.percent >= 100){ delI = i; this.moneyLeft -= 100; }
		shot.update(delta);
	}
	if(delI != null) this.shots.splice(delI, 1);
	if(this.shotDelta >= kitty.GABE_SHOT_TIME * 1000){
		console.log("shots fired!");
		var minW = kitty.rand(5, 10);
		var minH = minW * 5/12;
		this.shots.push(new kitty.GabeShot(
			{x: kitty.rand(80, kitty.WIDTH - 80), y: kitty.rand(80, kitty.HEIGHT - 80)},
			1000,
			minW, minH,
			minW * 20, minH * 20
		));
		this.shotDelta = 0;
	}
	if(this.up){
		if(this.mouthY <= this.mouthUY){ this.up = false; return; }
		this.mouthY -= 0.5 * delta;
	}else{
		if(this.mouthY >= this.mouthBY){ this.up = true; return; }
		this.mouthY += 0.5 * delta;
	}
	this.gv.canvas.setLayer(this.boxTextLayer,{
		text: "Gabe\nProgress: " + Math.round(this.time / (kitty.GABE_UPTIME * 1000) * 100) + "%\n" +
			  "Money left: " + Math.round(this.moneyLeft)
	});
};

kitty.Gabe.prototype.render = function(){
	this.gv.canvas.drawImage({
		x: this.pos.x, y: this.pos.y, 
		source: "imgs/gabe.png",
		fromCenter: false
	});
	this.gv.canvas.drawImage({
		x: this.pos.x + this.mouthX, y: this.pos.y + this.mouthY,
		source: "imgs/gabe_mouth.png",
		fromCenter: false
	});
	for(var i = 0; i < this.shots.length; ++i) this.shots[i].render(this.gv.canvas);
	this.gv.canvas.drawRect({
		fillStyle: "white",
		width: 140, height: 80,
		x: kitty.WIDTH - 140, y: 0,
		fromCenter: false
	});
	this.gv.canvas.drawLayer(this.boxTextLayer);
};

kitty.GabeShot = function(pos, duration, minW, minH, maxW, maxH){//img, dmg, v, minW, minH, maxW, maxH){
	this.pos = pos;
	this.duration = duration;
	this.minW = minW;
	this.minH = minH;
	this.maxW = maxW;
	this.maxH = maxH;
	this.percent = 0;
};

kitty.GabeShot.prototype.update = function(delta){
	this.percent += delta / this.duration * 100;
	this.percent = this.percent > 100 ? 100 : this.percent;
	//console.log(this.percent);
	this.w = this.percent * ((this.maxW - this.minW) / 100) + this.minW;
	this.h = this.percent * ((this.maxH - this.minH) / 100) + this.minH; 
};

kitty.GabeShot.prototype.render = function(canvas){
	canvas.drawRect({
		x: this.pos.x,
		y: this.pos.y,
		fillStyle: "green",
		width: this.w, height: this.h,
		fromCenter: true
	});
	canvas.drawText({
		x: this.pos.x,
		y: this.pos.y,
		text: "-" + Math.round(100 - this.percent) + "%",
		fillStyle: "white",
		fontSize: this.h,
		//fontSize: this.h,
		maxWidth: this.w, maxHeight: this.h,
		fromCenter: true
	});
};



kitty.Bosses = [kitty.Gabe];



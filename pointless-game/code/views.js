if(kitty.views == undefined)
	kitty.views = {};

kitty.MAX_INFO_DELTA = 500;

kitty.views.View = function(canvas) { this.canvas = canvas; };
kitty.views.View.prototype.update = function(){};
kitty.views.View.prototype.render = function(){};
kitty.views.View.prototype.start = function(){};
kitty.views.View.prototype.stop = function(){};

kitty.views.ScoreView = function(game, score, cb){
	this.game = game;
	this.canvas = game.canvas;
	this.cb = cb;
	this.score = score;
	this.defText = "Click to go to the menu!";
	this.canvas.addLayer({
		name: "text",
		type: "text",
		text: this.defText,
		fillStyle: "yellow",
		strokeStyle: "black",
		strokeWidth: 1,
		fontSize: 5,
		align: "left",
		x: kitty.WIDTH/2, 
		y: kitty.HEIGHT - 80,
		fromCenter: true
	});
	this.textLayer = this.canvas.getLayer("text");
	this.animateText(this.textLayer, 28, 30, 200);
	this.startDelta = 0;
};

kitty.views.ScoreView.prototype = new kitty.views.View();
kitty.views.ScoreView.constructor = kitty.views.ScoreView;

kitty.views.ScoreView.prototype.animateText = function(layer, min, max, time){
	var dis = this;
	dis.canvas.animateLayer(layer, {
		fontSize: max,
		strokeWidth: 1
	}, time, function(layer){
		dis.canvas.animateLayer(layer, {
			fontSize: min,
			strokeWidth: 0.1	
		}, time, function(layer){ dis.animateText(layer, min, max, time); });
	});
};

kitty.views.ScoreView.prototype.start = function(delta){
	this.startDelta = 0;
	this.doRender = true;
	var dis = this;
	var prev = new Date();
	var renderer = function(){
		if(dis.doRender){
			try{
				dis.update(Math.abs((new Date()) - prev));
				dis.render();
				prev = new Date();
			}catch(e){
				console.error(e);
			}
			setTimeout(renderer, delta);
		}
	};
	this.canvas.click(function(e){
		if(dis.startDelta > 2000) dis.cb();
		e.preventDefault();
	});
	renderer();
};

kitty.views.ScoreView.prototype.update = function(delta){
	this.startDelta += delta;
	this.canvas.setLayer(this.textLayer, {
		text: this.startDelta > 2000 ? this.defText : "Wait..."
	});
};

kitty.views.ScoreView.prototype.render = function(){
	this.canvas.clearCanvas();
	this.canvas.drawImage({
		source: "imgs/catbg.png",
		x: 0, y: 0,
		fromCenter: false
	});
	this.canvas.drawText({
		fillStyle: "black",
		fontSize: "50px",
		x: kitty.WIDTH/2, 
		y: kitty.HEIGHT/2 + 30,
		text: "You got " + this.score + " points!",
		fromCenter: true
	});
	this.canvas.drawText({
		fillStyle: this.score > 300 ? "yellow" : "red",
		fontSize: "40px",
		x: 100, 
		y: 200,
		text: this.score > 300 ? "Well done! :D" : "You can do better! :(",
		fromCenter: false,
		rotate: 30
	});
	this.canvas.drawLayer(this.textLayer);
};

kitty.views.ScoreView.prototype.stop = function(){
	this.doRender = false;
	this.canvas.removeLayers();
	this.canvas.unbind("click");
};



kitty.views.StartView = function(game, cb){
	this.game = game;
	this.canvas = game.canvas;
	this.cb = cb;
	this.defText = "Click to start!";
	this.canvas.addLayer({
		name: "text",
		type: "text",
		text: this.defText,
		fillStyle: "yellow",
		strokeStyle: "black",
		strokeWidth: 1,
		fontSize: 5,
		align: "left",
		x: kitty.WIDTH/2, 
		y: kitty.HEIGHT - 80,
		fromCenter: true
	});
	this.canvas.addLayer({
		name: "hello",
		type: "text",
		text: "get rekt plis",
		fillStyle: "blue",
		strokeStyle: "black",
		strokeWidth: 1,
		fontSize: 20,
		align: "left",
		x: 130,
		y: 130,
		rotate: -45,
		fromCenter: true
	});
	this.textLayer = this.canvas.getLayer("text");
	this.helloLayer = this.canvas.getLayer("hello");
	this.animateText(this.textLayer, 28, 30, 200);
	this.animateText(this.helloLayer, 20, 40, 1000);
	this.loaded = false;
}

kitty.views.StartView.prototype = new kitty.views.View();
kitty.views.StartView.constructor = kitty.views.StartView;

kitty.views.StartView.prototype.animateText = function(layer, min, max, time){
	var dis = this;
	dis.canvas.animateLayer(layer, {
		fontSize: max,
		strokeWidth: 1
	}, time, function(layer){
		dis.canvas.animateLayer(layer, {
			fontSize: min,
			strokeWidth: 0.1	
		}, time, function(layer){ dis.animateText(layer, min, max, time); });
	});
};

kitty.views.StartView.prototype.start = function(delta){
	this.doRender = true;
	var dis = this;
	var prev = new Date();
	var renderer = function(){
		if(dis.doRender){
			try{
				dis.update(Math.abs((new Date()) - prev));
				dis.render();
				prev = new Date();
			}catch(e){
				console.error(e);
			}
			setTimeout(renderer, delta);
		}
	};1
	this.canvas.click(function(){
		if(dis.loaded) dis.cb();
	});
	kitty.load(kitty.Images, function(){
		dis.loaded = true;
	});
	renderer();
};

kitty.views.StartView.prototype.update = function(delta){
	this.canvas.setLayer(this.textLayer, {
		text: this.loaded ? this.defText : "Loading shit.. Please wait"
	});
};

kitty.views.StartView.prototype.render = function(){
	this.canvas.clearCanvas();
	this.canvas.drawImage({
		source: "imgs/catbg.png", 
		x: 0, y: 0,
		fromCenter: false
	});
	this.canvas.drawText({
		fillStyle: "black",
		fontSize: "50px",
		x: kitty.WIDTH/2, 
		y: kitty.HEIGHT/2 + 30,
		text: "The Kitty Game",
		fromCenter: true
	});
	this.canvas.drawText({
		fillStyle: "black",
		fontSize: "10px",
		fontStyle: "bold",
		x: kitty.WIDTH/2, y: kitty.HEIGHT/2 + 65,
		text: "Written by Jaco Ruit",
		fromCenter: true
	});
	this.canvas.drawLayer(this.textLayer);
	this.canvas.drawLayer(this.helloLayer);
};

kitty.views.StartView.prototype.stop = function(){
	this.doRender = false;
	this.canvas.removeLayers();
	this.canvas.unbind("click");
};



kitty.views.GameView = function(game, maxTime, bossCount, cb){
	this.game = game;
	this.canvas = game.canvas;
	this.maxTime = maxTime;
	this.cb = cb;
	this.bossCount = bossCount;
	
	this.canvas.addLayer({
		name: "overlay",
		type: "rectangle",
		visible: false,
		x: 0, y: 0,
		width: kitty.WIDTH, height: kitty.HEIGHT,
		fromCenter: false
	});
	this.canvas.addLayer({
		name: "target",
		type: "arc",
		strokeStyle: "white",
		strokeWidth: 2,
		x: kitty.WIDTH / 2, y: kitty.HEIGHT / 2,
		start: 0,
		end: 360,
		radius: 20,
		fromCenter: true
	});
	this.canvas.addLayer({
		name: "target_img",
		type: "image",
		source: "imgs/heart.png",
		width: 30, height: 30,
		fromCenter: true,
		x: kitty.WIDTH / 2, y: kitty.HEIGHT / 2
	});
	this.canvas.addLayer({
		name: "info",
		type: "text",
		strokeStyle: "yellow",
		text: "",
		fontSize: 25,
		strokeWidth: 1,
		x: 0, y: 0,
		fromCenter: false
	});
	this.canvas.addLayer({
		name: "box",
		type: "rectangle",
		fillStyle: "white",
		width: 140, height: 50,
		fontSize: 20,
		x: 0, y: 0,
		fromCenter: false
	});
	this.canvas.addLayer({
		name: "box_text",
		type: "text",
		text: "",
		fillStyle: "black",
		fontSize: "20px",
		align: "left",
		x: 0, y: 5,
		maxWidth: 140,
		fromCenter: false
	});
	
	this.overLayer = this.canvas.getLayer("overlay");
	this.targetLayer = this.canvas.getLayer("target");
	this.targetImgLayer = this.canvas.getLayer("target_img");
	this.infoLayer = this.canvas.getLayer("info");
	this.boxLayer = this.canvas.getLayer("box");
	this.boxTextLayer = this.canvas.getLayer("box_text");
	this.infoDelta = 0;
	this.overlayId = 0;
	
	this.mousePos = this.mouseTilePos = {x: 0, y: 0};
	this.entities = [];
	
	this.time = 0;
	this.boss = null;
	this.bossDelta = 0;
	
	//this.debugSpawn = false;
};

kitty.views.GameView.prototype = new kitty.views.View();
kitty.views.GameView.constructor = kitty.views.GameView;

kitty.views.GameView.prototype.hit = function() {
	if(this.boss != null){
		this.boss.onClick();
		return;
	}
	var mouse = this.mousePos;
	var ind = null;
	for(var i = this.entities.length - 1; i > -1; --i){
		var ent = this.entities[i];
		var sx = ent.pos.x - ent.w / 2;
		var sy = ent.pos.y - ent.h / 2;
		if(mouse.x >= sx && mouse.y >= sy && mouse.x <= sx + ent.w && mouse.y <= sy + ent.h){
			ent.destroy();
			this.game.score += ent.points;
			if(ent.points > 0)
				this.displayInfo(ent.name + " +" + ent.points + " :D");
			else{ 
				this.displayInfo(ent.name + " -" + Math.abs(ent.points) + " :(");
				this.setOverlay([255, 0, 0], 70);
			}
			ind = i;
			break;
		}
	}
	if(ind != null){
		this.entities.splice(i, 1);
		if(Math.random() < 0.15) this.addEntity();
	} 
}

kitty.views.GameView.prototype.setOverlay = function(color, time){
	var colorStr = "rgba(" + color[0] + "," + color[1] + "," + color[2] + ", 0.3)";
	var id = this.overlayId = Math.random();
	this.canvas.setLayer(this.overLayer, {
		fillStyle: colorStr,
		visible: true
	});
	var dis = this;
	setTimeout(function(){
		if(dis.overlayId == id) 
			dis.canvas.setLayer(dis.overLayer, {
				visible: false
			});
	}, time);
}

kitty.views.GameView.prototype.displayInfo = function(txt){
	this.infoDelta = 0;
	this.canvas.setLayer(this.infoLayer, {
		text: txt
	});
};

kitty.views.GameView.prototype.spawnBoss = function(){
	console.info("We have a boss spawn!");
	var randI = kitty.rand(0, kitty.Bosses.length - 1);
	this.boss = new kitty.Bosses[randI](this);
	
};

kitty.views.GameView.prototype.spawnEntity = function(){
	if(this.boss != null) return;
	//if(!this.debugSpawn){
	if(this.bossDelta >= (this.maxTime / (this.bossCount + 1))){
		this.bossDelta = 0;
		this.entities = [];
		this.spawnBoss();
		this.debugSpawn = true;
		return;
	}
	var randI = kitty.rand(0, kitty.EntityTypes.length - 1);
	var type = kitty.EntityTypes[randI];
	var speedup = 1;
	if(type.points > 5) speedup += (type.points - 5) / 5;
	var uid = kitty.rand(0, 1000);
	var randPos = {x: kitty.rand(90, kitty.WIDTH - 90), y: kitty.rand(90, kitty.HEIGHT - 90)};
	var randV = {x:0,y:0};
	if(randPos.x > kitty.WIDTH * 3/4 || Math.random() < 0.5) randV.x = kitty.rand(-0.2, -0.3); 
	else randV.x = kitty.rand(0.2, 0.3);
	if(randPos.y > kitty.HEIGHT * 3/4 || Math.random() < 0.5) randV.y = kitty.rand(-0.2, -0.3); 
	else randV.y = kitty.rand(0.2, 0.3);
	randV.x = randV.x * speedup; randV.y = randV.y * speedup;
	var entity = new kitty.Entity(randPos, randV, uid.toString(), type, this.canvas);
	this.entities.push(entity);
};

kitty.views.GameView.prototype.start = function(rdelta, amaxdelta){
	this.doRender = true;
	var dis = this;
	var prev = new Date();
	var renderer = function(){
		if(dis.doRender){
			try{
				dis.update(Math.abs((new Date()) - prev));
				prev = new Date();
				dis.render();
			}catch(e){
				console.error(e);
			}
			setTimeout(renderer, rdelta);
		}
	};
	this.doAdd = true;
	var adder = function(){
		try{
			dis.spawnEntity();
		}catch(e){
			console.error(e);
		}
		if(dis.doAdd)
			setTimeout(adder, kitty.rand(amaxdelta / 2, amaxdelta));
	};
	this.canvas.mousemove(function(e){
		dis.mousePos = {
			x: e.pageX - $(this).offset().left,
			y: e.pageY - $(this).offset().top
		};
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
	});
	this.canvas.click(function(e){
		dis.mousePos = {
			x: e.pageX - $(this).offset().left,
			y: e.pageY - $(this).offset().top
		};
		dis.hit();
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
	});
	renderer();
	adder();
};

kitty.views.GameView.prototype.stop = function(){
	this.doAdd = false;
	this.doRender = false;
	this.canvas.unbind("mousemove");
	this.canvas.unbind("click");
	this.canvas.removeLayers();
};

kitty.views.GameView.prototype.removeEnts = function(delIs){
	for(var i = 0; i < delIs.length; ++i){ 
		var index = delIs[i] - i;
		this.entities[index].destroy();
		this.entities.splice(index, 1); 
	}
}

kitty.views.GameView.prototype.update = function(delta){
	if(this.boss == null || this.boss.hasEnded()){
		this.time += delta; 
		this.bossDelta += delta;
		if(this.boss != null){
			if(this.boss.hasWon()){ this.cb(); return; }
			else this.boss.onEnd();
		}
		this.boss = null;
	}else{
		try{this.boss.update(delta);}catch(e){console.error(e);}
	}
	
	
	if(this.infoDelta >= kitty.MAX_INFO_DELTA) this.displayInfo("");
	this.infoDelta += delta;
	
	var delIs = [];
	for(var i = 0; i < this.entities.length; ++i){
		var ent = this.entities[i];
		ent.update(delta);
		if(ent.pos.x >= kitty.WIDTH || ent.pos.y >= kitty.HEIGHT || ent.pos.x < 0 || ent.pos.y < 0) delIs.push(i); 
	}
	this.removeEnts(delIs);
	
	this.canvas.setLayer(this.boxTextLayer,{
		text: "Progress: " + Math.round((this.time / this.maxTime) * 100) + "%\n" +
			  "Score: " + Math.round(this.game.score)
	});
	
	if(this.time >= this.maxTime){
		this.cb();
	}
};

kitty.views.GameView.prototype.render = function(){
	this.canvas.clearCanvas();
	this.canvas.drawImage({
		source: "imgs/space.jpg", 
		x: 0, y: 0,
		height: kitty.HEIGHT, width: 858 * (kitty.HEIGHT/ 536),
		fromCenter: false
	});
	this.canvas.setLayer(this.targetLayer, {
		x: this.mousePos.x,
		y: this.mousePos.y
	});
	this.canvas.setLayer(this.targetImgLayer, {
		x: this.mousePos.x,
		y: this.mousePos.y
	});
	this.canvas.setLayer(this.infoLayer, {
		x: this.mousePos.x,
		y: this.mousePos.y - 50
	});
	for(var i = 0; i < this.entities.length; ++i) this.canvas.drawLayer(this.entities[i].layer);
	if(this.boss != null) this.boss.render();
	//this.canvas.drawLayer(this.targetImgLayer);
	this.canvas.drawLayer(this.targetLayer);
	this.canvas.drawLayer(this.infoLayer);
	this.canvas.drawLayer(this.overLayer);
	this.canvas.drawLayer(this.boxLayer);
	this.canvas.drawLayer(this.boxTextLayer);
};

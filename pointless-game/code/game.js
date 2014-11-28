var kitty = {};

kitty.WIDTH = 720;
kitty.HEIGHT = 600;
kitty.TIME = 120; //seconds

kitty.Game = function(game_canvas, container){
	this.container = container;
	this.canvas = game_canvas;
	this.score = 0;
	this.currentView = null;
	kitty.globgame = this;
};

kitty.Game.prototype.start = function(){
	this.stop();
	this.score = 0;
	var dis = this;
	this.currentView = new kitty.views.StartView(this, function(){
		dis.currentView.stop();
		dis.currentView = new kitty.views.GameView(dis, kitty.TIME * 1000, 1, function(){
			dis.stop();
			dis.currentView = new kitty.views.ScoreView(dis, dis.score, function(){
				dis.stop();
				dis.start();
			});
			dis.currentView.start();
		});
		dis.currentView.start(30, (kitty.TIME * 1000) / (kitty.TIME * 3));
	});
	this.currentView.start();
};

kitty.Game.prototype.stop = function(){
	if(this.currentView != null){
		this.currentView.stop();
	}
};


kitty.rand = function(min, max){
	return Math.round(Math.random() * max) + min;
};

kitty.load = function(images, callback, i) {
	if(i == undefined) i = 0;
	if(i == images.length) callback();
	var img = new Image();
	img.src = images[i];
	img.onload = function(){
		console.log("Loaded: " + img.src + "(" + (i + 1)  + "/" + images.length + ")");
		kitty.load(images, callback, ++i);
	};
}

kitty.Images = ["imgs/gabe_mouth.png", "imgs/gabe.png", "imgs/suppy.png", "imgs/kappa.png", "imgs/cat2.png", "imgs/cat1.png", "imgs/cat3.png", "imgs/csgo.png", "imgs/lol.png", "imgs/wow.png", "imgs/heart.png","imgs/catbg.png","imgs/space.jpg"];

kitty.EntityType = function(name, points, img, w, h){ this.name = name; this.points = points; this.img = img; this.w = w; this.h = h;};

kitty.EntityTypes = [
	new kitty.EntityType("Suppy", -20, "imgs/suppy.png", 311 * 3/8, 400 * 3/8),
	new kitty.EntityType("Kappa", -5, "imgs/kappa.png", 96, 130),
	new kitty.EntityType("Kappa", -5, "imgs/kappa.png", 96, 130),
	new kitty.EntityType("Kappa", -5, "imgs/kappa.png", 96, 130),
	new kitty.EntityType("Kappa", -5, "imgs/kappa.png", 96, 130),
	new kitty.EntityType("Kappa", -5, "imgs/kappa.png", 96, 130),
	new kitty.EntityType("Cat", 3, "imgs/cat3.png", 474 * 1/4, 532 * 1/4),
	new kitty.EntityType("Cat", 3, "imgs/cat3.png", 474 * 1/4, 532 * 1/4),
	new kitty.EntityType("Cat", 2, "imgs/cat2.png", 200 * 1/2, 336 * 1/2),
	new kitty.EntityType("Cat", 2, "imgs/cat2.png", 200 * 1/2, 336 * 1/2),
	new kitty.EntityType("Cat", 2, "imgs/cat2.png", 200 * 1/2, 336 * 1/2),
	new kitty.EntityType("Cat", 1, "imgs/cat1.png", 167 * 3/4, 200 * 3/4),
	new kitty.EntityType("Cat", 1, "imgs/cat1.png", 167 * 3/4, 200 * 3/4),
	new kitty.EntityType("Cat", 1, "imgs/cat1.png", 167 * 3/4, 200 * 3/4),
	new kitty.EntityType("Cat", 1, "imgs/cat1.png", 167 * 3/4, 200 * 3/4),
	new kitty.EntityType("Cat", 1, "imgs/cat1.png", 167 * 3/4, 200 * 3/4),
	new kitty.EntityType("Cat", 1, "imgs/cat1.png", 167 * 3/4, 200 * 3/4),
	new kitty.EntityType("CS:GO", 8, "imgs/csgo.png", 512 * 1/4, 512 * 1/4),
	new kitty.EntityType("CS:GO", 8, "imgs/csgo.png", 512 * 1/4, 512 * 1/4),
	new kitty.EntityType("CS:GO", 8, "imgs/csgo.png", 512 * 1/4, 512 * 1/4),
	new kitty.EntityType("WoW", 10, "imgs/wow.png", 512 * 1/4, 509 * 1/4),
	new kitty.EntityType("LoL", 20, "imgs/lol.png", 512 * 1/4, 512 * 1/4)
];

kitty.Entity = function(pos, v, uid, type, canvas){
	this.pos = pos;
	this.v = v;
	this.uid = uid;
	this.name = type.name;
	this.points = type.points;
	this.w = type.w;
	this.h = type.h;
	this.estr = "enitity_" + uid;
 	this.canvas = canvas;
	this.canvas.addLayer({
		name: this.estr,
		type: "image",
		source: type.img,
		width: type.w,
		height: type.h,
		x: this.pos.x, y: this.pos.y,
		fromCenter: true
	});
	this.layer = canvas.getLayer(this.estr);
};

kitty.Entity.prototype.update = function(delta){
	this.pos.x += this.v.x * delta;
	this.pos.y += this.v.y * delta ;
	this.canvas.setLayer(this.layer, {
		x: this.pos.x,
		y: this.pos.y
	});
};

kitty.Entity.prototype.destroy = function(){
	this.canvas.removeLayer(this.estr);
};




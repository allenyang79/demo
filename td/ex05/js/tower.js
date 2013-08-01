define(['createjs','underscore','global','gsap','sylvester'],function () {
	var Tower=function(params){
		console.log("[Tower]init");
		createjs.Container.apply(this,arguments);
		this.attrs={};
		_.extend(this.attrs,params);
		
		//搜尋範圍
		this.set('radius',75);
		
		
		this.render();

		this.x=this.get('currCell').x;
		this.y=this.get('currCell').y;
		console.dir(this);
	};
	
	//this
	Tower.prototype=_.extend(Tower.prototype,createjs.Container.prototype);
	/*
		@add method or property
		Cell.prototype.foo=function(){....}
	*/
	//Cell.prototype.map=null;
	Tower.prototype.get=function(key){
		if(this.attrs[key]!==null)
			return this.attrs[key];
		else{
			return undefined;
		}
	}
	Tower.prototype.set=function(key,value){
		this.attrs[key]=value;
		this.dispatchEvent('change:'+key,this);
	}
	Tower.prototype.del=function(key){
		delete this.attrs[key];
	}
	Tower.prototype.render=function(){
		console.log("[Tower]render");
		var sp=this.get('sp');
		if(sp){
			this.removeChild(sp);
		}
		sp=new createjs.Container;
		var shape;
		
		shape=new createjs.Shape();
		shape.graphics
			.beginFill(createjs.Graphics.getRGB(128, 255,128, 0.2))
			.drawCircle(0,0,this.get('radius'));
		sp.addChild(shape);
		
		shape=new createjs.Shape();
		shape.graphics
			.beginFill('#0000ff')
			.drawPolyStar(0,0,15,4,0.6,0);
		sp.addChild(shape);
		
		shape=new createjs.Shape();
		shape.graphics
			.beginFill('#9999ff')
			.drawPolyStar(0,0,12,8,0.6,0);
		sp.addChild(shape);
		

		this.addChild(sp);
		this.set('sp',sp);
		
		
		//searchFunc ==================================================
		this.searchMonster=function(){
			console.log("[Towner]searchMonster");
			
			
		}.bind(this);
	}
	Tower.startSearch=function(){	
		createjs.Ticker.addEventListener("tick",this.searchMonster);
	}
	Tower.stopSearch=function(){
		createjs.Ticker.removeEventListener("tick",this.searchMonster);			
	}

	
	//Tower
	var Attack=function(params){
		console.log("[Attack]init");
		createjs.Container.apply(this,arguments);
		this.attrs={};
		_.extend(this.attrs,params);
		this.addChild(this.bg);

		this.x=this.get('currCell').x;
		this.y=this.get('currCell').y;
	};
	
	Attack.prototype=createjs.Container.prototype;
	/*
		@add method or property
		Cell.prototype.foo=function(){....}
	*/
	//Cell.prototype.map=null;
	Attack.prototype.get=function(key){
		if(this.attrs[key]!==null)
			return this.attrs[key];
		else{
			return undefined;
		}
	}
	Attack.prototype.set=function(key,value){
		this.attrs[key]=value;
		this.dispatchEvent('change:'+key,this);
	}
	Attack.prototype.del=function(key){
		delete this.attrs[key];
	}
	
	createjs.Tower=Tower;
	createjs.Attack=Attack;
});
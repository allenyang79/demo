define(['createjs','underscore','global','gsap','sylvester'],function () {
	var Monster=function(params){
		console.log("[Monster]init");
		createjs.Container.apply(this,arguments);
		this.attrs={};
		_.extend(this.attrs,params);
		
		this.set('color',"#ff0000");
		this.x=this.get('currCell').x;
		this.y=this.get('currCell').y;
		
		this.render();
		//this.rotation=90;
		
		//stagemousemove
		/*
		var stage=this.getStage();
		stage.addEventListener('click',function(){			
			//算出角度
			console.log("click");
		});
		*/
		//var stage=this.getStage();
		/*
		stage.addEventListener('stagemousemove',function(){
			//alert("CC");
			this.rotation=Math.atan2(stage.mouseY-this.y,stage.mouseX-this.x) * 180 / Math.PI;
		}.bind(this));	
		*/
	};
	
	//Monster.prototype=createjs.Container.prototype;
	Monster.prototype=_.extend(Monster.prototype,createjs.Container.prototype);
	/*
		@add method or property
		Cell.prototype.foo=function(){....}
	*/
	//Cell.prototype.map=null;
	Monster.prototype.get=function(key){
		if(this.attrs[key]!==null)
			return this.attrs[key];
		else{
			return undefined;
		}
	}
	Monster.prototype.set=function(key,value){
		this.attrs[key]=value;
		this.dispatchEvent('change:'+key,this);
	}
	Monster.prototype.del=function(key){
		delete this.attrs[key];
	}
	Monster.prototype.render=function(){
		console.log("[Monster]render");
		var shape=this.get('shape');;
		if(!shape){
			shape=new createjs.Shape(g);
			this.set('shape',shape);
			this.addChild(shape);
		}
		shape.graphics.clear();
		var g = shape.graphics
		.beginFill(this.get('color'))
		.drawPolyStar(0,0,15,3,0.6,0);
	}
	Monster.prototype.startRun=function(){
		//console.log("[Monster]startRun");
		//console.dir(this);
		if(this.get('currCell').get('isEndCell')){
			//alert("oops");
			//this.get('stage'
			return;
		}

		if(!this.get('moveTween')){
			var nextCell=this.get('currCell').get('nextCell');
			//角度
			this.rotation=Math.atan2(nextCell.y-this.y,nextCell.x-this.x) * 180 / Math.PI;
			//gsap
			var moveTween=TweenLite.to(this, 1, {
				x:nextCell.x,
				y:nextCell.y,
        ease:Linear.easeNone,
				onComplete:this.runComplete.bind(this)
			});
		}
	}
	Monster.prototype.runComplete=function(){
		//console.dir("runComplete");
		//console.dir(this);
		var nextCell=this.get('currCell').get('nextCell');
		this.set('currCell',nextCell);
		this.startRun();
		
	}	
	createjs.Monster=Monster;
	return Monster;
});
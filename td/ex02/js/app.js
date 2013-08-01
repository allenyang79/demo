define(['createjs','ui','backbone'],function (arg1,arg2,Scene) {
	Backbone.Singleton = {
	   getInstance: function () {
	     if (this._instance === undefined) {
	       this._instance = new this();
	     }
	     return this._instance;
	   }
	}
	//App
	var App=Backbone.Model.extend({
		config:{
			
		},
		default:{
			cellWidth:30,
			cellHeight:30,
			rowTotal:0,
			colTotal:0,
			checkerCollection:null,
		},
		initialize:function(){
			console.log('[App]initialize');
			var mapData=[
				[0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
				[0,1,0,1,0,1,0,1,1,1,1,1,0,1,1,0,1],
				[0,1,0,1,0,1,0,0,0,0,1,1,0,0,1,0,1],
				[0,0,0,1,0,1,0,1,1,1,1,1,1,1,1,0,1],
				[1,1,0,1,0,1,0,0,0,0,0,1,0,0,0,0,1],
				[1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1],
				[1,1,0,1,0,0,0,0,0,1,0,1,0,1,1,1,1],
				[0,0,0,1,1,1,1,1,0,0,0,1,0,0,0,0,0]
			];
			this.set('mapData',mapData);
			
			var colTotal=mapData[0].length;
			var rowTotal=mapData.length;
			this.set('colTotal',colTotal);
			this.set('rowTotal',rowTotal);

			var collection=new Backbone.Collection;
			this.set('checkerCollection',collection);

			for(var i=0;i<colTotal;i++){
				for(var j=0;j<rowTotal;j++){
					var checkerboard=new Checkerboard({x:i,y:j,type:mapData[j][i]});
					mapData[j][i]=checkerboard;
					collection.add(checkerboard);
				}
			}
			
			this.set('startChecker',this.get('mapData')[0][0]);
			this.set('endChecker',this.get('mapData')[7][17]);
		},
		initAllChecker:function(){
			for(var i=0;i<this.get('colTotal');i++){
				for(var j=0;j<this.get('rowTotal');j++){
					var checkerboard=this.getChecker(i,j);
					checkerboard.initFoundation();
					checkerboard.connectAround();
				}
			}
		},
		getChecker:function(i,j){
			return this.get("mapData")[j][i];
		},
		getStartChecker:function(){
			return this.get('startChecker');
		},
		getEndChecker:function(){
			return this.get('endChecker');
		}
	});
	//singleton 
	_.extend( App, Backbone.Singleton );
	
	//AppView
	var AppView=Backbone.View.extend({
		initialize:function(){
			console.log("[AppView]init");
			this.stage=new createjs.Stage(this.$el.attr('id'));
			
			this.tick=_.bind(function(){
				this.stage.update();
				
			},this);
			createjs.Ticker.addEventListener("tick",this.tick);
			
		},
		render:function(){
			return this;
		},
		buildMap:function(){
			var app=App.getInstance();
			var collection=this.model.get('checkerCollection');
			collection.each(function(checkerboard){				
			});
		}
	});

	
	var Checkerboard=Backbone.Model.extend({
		default:{
			x:0,
			y:0,
			type:0 //0:road,1:build ,
		},
		getCheckerBoardDistance:function(checkerBoard){
			
		},
		connectAround:function(){
			
			console.log("[cell]connectAround");
			var app=App.getInstance();
			//left
			if(this.get('x')==0)
				this.set('left',false);
			else{
				var checker=app.getChecker(this.get('x')-1,this.get('y'));
				if(checker.get('type')===0){
					this.set('left',checker);
				}
			}

			//top
			if(this.get('y')==0)
				this.set('top',false);
			else{
				var checker=app.getChecker(this.get('x'),this.get('y')-1);
				if(checker.get('type')===0){
					this.set('top',checker);
				}
			}
			
			//right
			if(this.get('x')==app.get('colTotal')-1)
				this.set('right',false);
			else{
				var checker=app.getChecker(this.get('x')+1,this.get('y'));
				if(checker.get('type')===0){
					this.set('right',checker);
				}
			}
			
			//bottom
			if(this.get('y')==app.get('rowTotal')-1)
				this.set('bottom',false);
			else{
				var checker=app.getChecker(this.get('x'),this.get('y')+1);
				if(checker.get('type')===0){
					this.set('bottom',checker);
				}
			}		
		},
		findShortPath:function(){
			//最短路徑
		}
	});

	//CheckerboardView
	var CheckerboardView=function(model){
		createjs.Container.apply(this,arguments);
		this.model=model;
	};
	CheckerboardView.prototype=createjs.Container;
	CheckerboardView.prototype.constructor=CheckerboardView;
	CheckerboardView.initFoundation=function(){
		var app=App.getInstance();


		var g = new createjs.Graphics()
		.beginFill('#efefef')
		.drawRect(app.get('cellWidth')*-0.5, app.get('cellHeight')*-0.5, app.get('cellWidth')*0.5,app.get('cellHeight')*0.5);
    var shape=new createjs.Shape(g);
		this.addChild(shape);
		this.x=app.get('cellWidth')*0.5+this.model.get('x')*app.get('cellWidth');
		this.y=app.get('cellHeight')*0.5+this.model.get('y')*app.get('cellHeight');
	}
		
	//code here
	var app=App.getInstance();
	app.initAllChecker();
	
	var appView=new AppView({model:app,el:"#canvas"});
	
	
});

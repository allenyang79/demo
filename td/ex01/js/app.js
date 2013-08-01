define(['createjs','ui','Scene'],function (arg1,arg2,Scene) {
  return {
  	attrs:{},
  	chessboard:[[],[]],
  	map:null,//load map.json
  	mapData:null,
  	startPosition:null,//怪獸起點
  	endPosition:null,//怪獸終點
		init: function () {
			self=this;
			this.stage = new createjs.Stage("canvas");
			
			//init map
			self.map=new createjs.Container;
			
			$.getJSON('assets/map.json',function(result){
				_.extend(self.attrs,result);
				console.log("attrs");
				console.dir(self.attrs);
				/*
				self.buildMap();
				self.stage.addChild(self.map);
			  this.stage.update();
			  */
			});


				
		  this.stage.update();
		  createjs.Ticker.addEventListener("tick", _.bind(this.tick,this));
			createjs.Ticker.setFPS(20);
		
			/*		
			console.dir(Scene);
    	var self=this;

    	this.circle = new createjs.Shape();
			this.circle.graphics.beginFill("red").drawCircle(0, 0, 50);
			this.circle.x = 100;
			this.circle.y = 100;
			this.stage.addChild(this.circle);
			
			this.myButton = new Button("label");
			this.stage.addChild(this.myButton);

			//load hero texture

			$.getJSON('assets/hero.json',function(json){				
				console.dir(json);
				var sheet=new createjs.SpriteSheet(json);
				var sp=new createjs.BitmapAnimation(sheet);
				sp.gotoAndPlay('fly');
				console.dir(sp);
				sp.x=sp.width*-0.5;
				sp.y=sp.height*-0.5;

				
				self.hero=new createjs.Container;
				self.hero.addChild(sp);

				self.stage.addChild(self.hero);
			});
			
			
			self.stage.addEventListener('stagemousemove',function(e){
				//console.dir(self.stage);
			});
			*/
    },
    tick:function(event){
			// time based
			/*
			this.circle.x = this.circle.x + (event.delta)/1000*100;
			if (this.circle.x > this.stage.canvas.width) { this.circle.x = 0; }
			
			// not time based:
			this.circle.x = this.circle.x + 5; // 100 / 20 = 5
			if (this.circle.x > this.stage.canvas.width) { 
				this.circle.x = 0; 
			}
		
			if(this.hero){
				this.hero.x+=(this.stage.mouseX-this.hero.x)*0.1;
				this.hero.y+=(this.stage.mouseY-this.hero.y)*0.1;
			}
			*/	
			this.stage.update(event);	    	
			
    },
    buildMap:function(){
    	//each cell
	    for(i=0;i<self.COL;i++){
		    for(j=0;j<self.ROW;j++){
		    	if(j%2==0)
			    	color=(self.COL*j+i)%2==0?"#efefef":"#cccccc";
			    else
		    		color=(self.COL*j+i)%2==1?"#efefef":"#cccccc";
					var cell=self.buildCell(i,j,color);
					self.map.addChild(cell);
		    }
	    }
	    
	    //build road
	    
    },
    buildCell:function(i,j,color){
			var g = new createjs.Graphics().beginFill(color).drawRect(self.CELL_WIDTH*-0.5, self.CELL_HEIGHT, self.CELL_WIDTH, self.CELL_HEIGHT);
	    var shape=new createjs.Shape(g);
	    var cell=new createjs.Container;
	    cell.addChild(shape);
	    cell.x=self.CELL_WIDTH*-0.5+i*self.CELL_WIDTH;
	    cell.y=self.CELL_HEIGHT*-0.5+j*self.CELL_HEIGHT;

			this.chessboard[i][j]=cell;
	    return cell;
    },
    buildTower:function(x,y){
    	//cell position
    },
    buildMonster:function(){
    	//bala bala
	    
    }
	}
});

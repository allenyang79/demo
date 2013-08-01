var RunAwayArrow=(function(){
			var MAX_STEER_FORCE=30;//最大操作力
			var MAX_FORCE=30;//最大執行力
			var EFFECT_DISTANCE=50;//有視野效範
			
			var Arrow=function(){
				createjs.Container.apply(this);
				
				this.currVel=new toxi.geom.Vec2D(0,0);
				this.desireVel=new toxi.geom.Vec2D(0,0);
				this.steerVel=new toxi.geom.Vec2D(0,0);
			
				console.log("[RunAwayArrow]init");
				
				this.velSp=new createjs.Shape();
				
				this.effectCircle=new createjs.Shape();
				this.effectCircle.graphics
					.beginStroke(createjs.Graphics.getRGB(0x000000,0.2))
					.drawCircle(0,0,EFFECT_DISTANCE)
					.endStroke();
					
				this.arrowBody=new createjs.Shape();
		    this.arrowBody.graphics
			    .beginFill(createjs.Graphics.getRGB(0x0000ff,0.5))
			    .moveTo(8,0)
			    .lineTo(-15,10)
			    .lineTo(-10,0)
			    .lineTo(-15,-10)
			    .lineTo(8,0)
			    .endStroke();
				
				this.addChild(this.velSp);	
				this.addChild(this.effectCircle);
				this.addChild(this.arrowBody);
				
				//==method================================================================================================
				this.getPositionVec2D=function(){
					new toxi.geom.Vec2D(this.x,this.y);
				}
				//取得zombie list
				this.getZombieList=function(){
					return zombieCollection;
				}
				//觀查
				this.calculateDesireVal=function(){
					var self=this;
					var zList=this.getZombieList();	
					var total=0;
					
					self.desireVel=new toxi.geom.Vec2D(0,0);				
					_.each(zList,function(zombie){
						//fixed 越近的越強烈
						var d=new toxi.geom.Vec2D(zombie.x-self.x,zombie.y-self.y);
						var distance=d.magnitude();
						if(distance>EFFECT_DISTANCE){
							return;
						}
						else{
							total++;
							d.scaleSelf(-1);
							d=d.getNormalizedTo(EFFECT_DISTANCE).subSelf(d);
							self.desireVel.addSelf(d);
						}
					});
					
					if(total>0){
						self.desireVel.scaleSelf(1/total);
						//console.log(self.desireVel.x+","+self.desireVel.y)
						//self.desireVel=self.desireVel.normalize().scaleSelf(EFFECT_DISTANCE);
					}
				}
				//操作
				this.calculateSteerVal=function(){
					var sefl=this;
					this.steerVel=sefl.desireVel.sub(sefl.currVel);//.getNormalizedTo(EFFECT_DISTANCE);
					//this.currVel.sub(self.desireVel.getNormalizedTo(EFFECT_DISTANCE));
				}
				//整合
				this.calculateCurrVal=function(f){
					this.currVel.addSelf(this.steerVel.scale(0.5));
					this.currVel=this.currVel.limit(MAX_FORCE).normalize();
					this.currVel=this.currVel.normalize().scaleSelf(MAX_FORCE);
					//this.currVel.scaleSelf(MAX_FORCE);	
				}
				this.run=function(){
					this.x+=this.currVel.x*0.05;
					this.y+=this.currVel.y*0.05;
					
			    var degree=this.currVel.copy().toPolar().y*180/Math.PI;
	        this.arrowBody.rotation=degree;

        	var stage=this.getStage();	        
	        if(stage){
						var stageWidth=stage.canvas.clientWidth;
						var stageHeight=stage.canvas.clientHeight;
						if(this.x>stageWidth)
							this.x=0;
						else if(this.x<0)
							this.x=stageWidth;
							
						if(this.y>stageHeight)
							this.y=0;
						else if(this.y<0)
							this.y=stageHeight;
	        }
				}
				//==繪製力線圖================================================================================================
				this.drawVel=function(){
					//console.log("[Arrow]drawVel");
	
					 //drawing
					this.velSp.graphics
						.clear()
	
					  .setStrokeStyle(3,'rect')
					  .beginStroke(createjs.Graphics.getRGB(0x000000,0.5))
					  .moveTo(0,0)
					  .lineTo(this.desireVel.x,this.desireVel.y)
					  .endStroke()
					  //===================
					  .setStrokeStyle(2,'rect')
					  .beginStroke(createjs.Graphics.getRGB(0x0000ff,0.5))
					  .moveTo(0,0)
					  .lineTo(this.steerVel.x,this.steerVel.y)
					  .endStroke()
					  //===================
					  .setStrokeStyle(1,'rect')
					  .beginStroke(createjs.Graphics.getRGB(0x00ff00,0.5))
					  .moveTo(0,0)
					  .lineTo(this.currVel.x,this.currVel.y)
					  .endStroke();
				}
	
				this.tick=function(){
					this.calculateDesireVal();
					this.calculateSteerVal();
					this.calculateCurrVal();
					this.run();
					
					this.drawVel();
				}
			}
			Arrow.prototype=new createjs.Container;
			return Arrow;
		}());
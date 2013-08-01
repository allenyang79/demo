console.log("load mapview.js");
define(['Map'],function(){
		//==============================
	var MapView=function(options){
		createjs.Container.apply(this,arguments);
		
		this.model=options.model;
		this.x=this.options.model.get('x')*30;
		this.y=this.options.model.get('y')*30;
		
		if(this.eanblePass()){
		}else{
		}
		this.onClick=function(){
			console.log("[Cell]onClick as "+this.model.get('x')+","+this.model.get('y'));

		}.bind(this);
		this.addEventListener('click',this.onClick);
	}
	MapView.prototype=new createjs.Container;
	return MapView;
});


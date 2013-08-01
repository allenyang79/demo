define('zombie',['underscore','createjs'],function(){
	var instance=null;
	//method
	var Zombie=function(n){
		createjs.Container.apply(this);
		this.num=n;
	}
	Zombie.prototype=new createjs.Container;
	Zombie.prototype.foo=function(){
		var num=1;
		var self=this;
		_.each([0,1,2,3,4,5],function(){
			self.num+=num;			
			console.log(self.num);
		})
		console.log(this.name+":"+this.num);
	}
	Zombie.prototype.bar=function(){
		var num=1;
		this.num+=num;
		console.log(this.name+":"+this.num);
	}
	return Zombie;

	
	//==ZombieInie========================================
	var ZombieInit=function(){
		this.collection=[];
	}
	ZombieInit.prototype.create=function(){
		
	}
	ZombieInit.prototype.remove=function(){
		
	}
	ZombieInit.get=function(id){
		
	}

	
	//singlton
	if(instance==null){
		instance=new ZombieInit;	
	}	
	return instance;
});
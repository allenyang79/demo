define(['main'],function (){
	var MySigletion=(function(){
		var instance;
		
		//真的實體
		function init(){
			var items=[];
			function _thinking(){
				console.log("_thinking");
			}
			function _thinkingElse(){
				console.log("_thinkingElse");
			}
			
			return {
				doSomething:function(){
					console.log("doSomething");
				},
				walk:function(){
					console.log("walk");
				},
				addItem:function(item){
					items.push(item);
				},
				getItems:function(){
					console.dir(items);
				}
			}
		}
		//end init
		return {
			getInstance:function(){
				if(!instance)
					instance=init();
				return instance;
			}
		}
	}());
	//MySigletion
	var a=MySigletion.getInstance();
	var b=MySigletion.getInstance();
	
	a.addItem(1);
	a.addItem(2);
	a.addItem(3);
	b.addItem("a");
	b.addItem("b");
	b.addItem("c");
	a.getItems();
	b.getItems();
	console.log(a===b);
});
console.log("app.js load");

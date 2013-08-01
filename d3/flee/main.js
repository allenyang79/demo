/******************************
* text Code
******************************/
//var t=new toxi.geom.Vec2D(0.5,0);
//console.dir(t.normalize());
/******************************
* main code
******************************/
var w=400,h=400;
var svg=d3.select('body')
    .append('svg')
    .attr('width',500)
    .attr('height',500);

var xScale=d3.scale.linear()
    .domain([-30,30]).range([0,w]);
var xAxis=d3.svg.axis()
    .scale(xScale).orient('bottom').ticks(8);
var yScale=d3.scale.linear()
    .domain([-30,30]).range([0,h]);
var yAxis=d3.svg.axis()
    .scale(yScale).orient('left').ticks(8);

var scene=svg.append('g')
    .attr('class','scene')
    .attr('transform','translate(35,20)');
var axes=scene.append('g').attr('class','axes');

axes.append('g').attr('class','axis xAxis')
    .attr('transform','translate(0,200)')
    .call(xAxis);
axes.append('g').attr('class','axis yAxis')
    .attr('transform','translate(200,0)')
    .call(yAxis);

var MAX_FORCE=10;
var _02f=d3.format('.2f');

//==target================================================================================================
var target={
	className:'target',
	from:new toxi.geom.Vec2D(0,0).jitter(20),
	to:new toxi.geom.Vec2D(0,0),
	onDrag:function(){
		//var dragTarget = d3.select(this);
		
		var mouseX=d3.event.x;
		var mouseY=d3.event.y;
		this.from.x=xScale.invert(mouseX)
		this.from.y=yScale.invert(mouseY)
		
		redraw();
	},
	initDraw:function(el){
		this.el=el;
		this.el.attr('class',this.className);
		
		//circle
		this.el.append('circle')
		.attr('class','from')
		.attr('r',5)
		.call(d3.behavior.drag().on("drag",_.bind(this.onDrag,this)));
		
		//from text
		this.el.append('text').attr('class','from')
		//line
		this.el.append('line')
		
		this.updateDraw();
	},
	updateDraw:function(){
		this.el.select('circle.from')
		.attr('cx',xScale(this.from.x))
		.attr('cy',yScale(this.from.y))	
		
		//to text
		this.el.select('text.from')
		.text(this.className+":"+_02f(this.from.x)+","+_02f(this.from.y))
		.attr('x',xScale(this.from.x)+10)
		.attr('y',xScale(this.from.y)+10);
		
		//line
		this.el.select('line')
		.attr('x1',xScale(this.from.x))
		.attr('y1',yScale(this.from.y))
		.attr('x2',xScale(this.to.x))
		.attr('y2',yScale(this.to.y))	
	}
};

//==curr================================================================================================
var curr={
	className:'curr',
	from:new toxi.geom.Vec2D(0,0),
	to:toxi.geom.Vec2D.randomVector().scaleSelf(MAX_FORCE),
	onDrag:function(d){
		var dragTarget = d3.select(this);
		var mouseX=d3.event.x;
		var mouseY=d3.event.y;
		d.to.x=xScale.invert(mouseX)
		d.to.y=yScale.invert(mouseY)
		
		redraw();
	},
	initDraw:function(el){
		this.el=el;
		this.el.attr('class',this.className);
		
		//circle
		this.el.append('circle')
		.attr('class','to')		
		.attr('r',5)
		.call(d3.behavior.drag().on("drag",_.bind(this.onDrag,this)));
		//to text
		this.el.append('text').attr('class','to')
		//line
		this.el.append('line');
		
		this.updateDraw();
	},
	updateDraw:function(){
		this.el.select('circle.to')
		.attr('cx',xScale(this.to.x))
		.attr('cy',yScale(this.to.y))	
		
		//to text
		this.el.select('text.to')
		.text(this.className+":"+_02f(this.to.x)+","+_02f(this.to.y))
		.attr('x',xScale(this.to.x)+10)
		.attr('y',yScale(this.to.y)+10);
		
		//line
		this.el.select('line')
		.attr('x1',xScale(this.from.x))
		.attr('y1',xScale(this.from.y))
		.attr('x2',xScale(this.to.x))
		.attr('y2',xScale(this.to.y))	
	}
};



var desire=_.extend({},curr);
desire.onDrag=function(){return;}
desire.className="desire";

var steer=_.extend({},curr);
steer.onDrag=function(){return;}
steer.className="steer";
var projection=_.extend({},curr);
projection.onDrag=function(){return;}
projection.className="projection";
var next=_.extend({},curr);
next.onDrag=function(){return;}
next.className="next";

var dataSet=[target,curr,desire,projection,steer,next];
var mainLayer=scene.append('g')
	.attr('class','layer');
	
mainLayer.selectAll('g')
.data(dataSet)
.enter()
.append('g')
.each(function(d){
	d.initDraw(d3.select(this));
});




function calculate(){
	desire.to=target.from.sub(curr.from).scale(-1);
	desire.to.limit(MAX_FORCE);
	
	//內積投影算法
	/*
	//curr投在desire上
	dot=desire.to.getNormalized().dot(curr.to);
	projection.velocity=desire.to.getNormalized().scale(dot);
	projection.velocity.limit(MAX_FORCE);
	projection.to=projection.velocity.copy();
	if(dot>0)
    steer.velocity=projection.velocity.copy();
	else
	  steer.velocity=projection.velocity.scale(-1);
	*/
	

	steer.velocity=desire.to.sub(curr.to);
	steer.velocity.limit(MAX_FORCE);
	steer.from=curr.to.copy();
	steer.to=steer.from.add(steer.velocity);

	//steer投在curr
	/*
	var dot=curr.to.getNormalized().dot(steer.velocity);
	projection.velocity=curr.to.getNormalized().scale(dot);
	projection.from=steer.from.copy();
	projection.to=projection.from.add(projection.velocity);
	*/
	//curr投在steer上
	var dot=steer.velocity.getNormalized().dot(curr.to.scale(-1));	
	projection.velocity=steer.velocity.getNormalized().scale(dot);
	projection.from=steer.from.copy();
	projection.to=projection.from.add(projection.velocity);
	
	next.from=curr.from.copy();
	next.velocity=curr.to.add(steer.velocity).limit(MAX_FORCE);
	next.to=next.from.add(next.velocity);
}

function redraw(){	
	calculate();
	_.each(dataSet,function(d){
		d.updateDraw(d);
	});
	/*
	target.el.each(function(d){
		d.el.select('.body')
		.attr('cx',xScale(d.position.x))
		.attr('cy',yScale(d.position.y));
	})
	/*
	drawVector(original,curr,'curr');
	drawVector(original,desire,'desire');
	
	drawVector(original,forward,'forward');
	drawVector(original,projection,'projection');
	drawVector(curr,steer,'steer');
	drawVector(curr,next,'next');
	*/
}
function reDrawVector(el,p1,p2,className){
    scene.append('line')
    .attr('class','vec '+className)
    .attr('x1',xScale(p1.x))
    .attr('y1',yScale(p1.y))
    .attr('x2',xScale(p1.x+p2.x))
    .attr('y2',yScale(p1.y+p2.y));
    
    scene.append('text')
    .text(className)
    .attr('x',xScale(p1.x+p2.x))
    .attr('y',yScale(p1.y+p2.y))
}





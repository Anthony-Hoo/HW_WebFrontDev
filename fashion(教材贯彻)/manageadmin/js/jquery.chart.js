// 自定义表格插件
// @author guoqy
// @company QST
;(function($,window,document,undefined) {
	var defaults={bgColor:[{drawColor:"red"},
			{drawColor:"green"},
			{drawColor:"yellow"},
			{drawColor:"blue"},
			{drawColor:"gray"}],
			frontColor:{
				font:"12px 宋体",
				color:"black"
			}
		};
	//构造方法
	function DataDrawer(element,data,options){
		this.$element = element;
		this.drawType=data.drawType;	//绘制类型
		this.drawData=data.drawData;	//绘制数据
		this.setting=$.extend({}, defaults, options);
	};
	//添加属性或方法
	DataDrawer.prototype={
		//绘制圆饼图
		drawPieChart:function(){
			var startPoint=1.5*Math.PI;  //开始位置
			var endPoint=0;
			var context=this.$element.get(0).getContext("2d");
			for(var i=0;i<this.drawData.length;i++){  
				context.fillStyle = this.setting.bgColor[i].drawColor;  
				context.strokeStyle = this.setting.bgColor[i].drawColor;  
				//开始创建路径
				context.beginPath();
				//开始创建路径（圆心）
				context.moveTo(150,150); 
				//计算弧形结束位置的角度
				endPoint=startPoint-Math.PI*2*(this.drawData[i].amount/this.allData);
				//开始创建路径 （弧形圆心）
				context.arc(150,150,90,startPoint,endPoint,true);  
				context.fill();  
				context.stroke();
				//保存状态
				context.save();
				
				//计算文本角度
				var textAngle=(startPoint+endPoint)/2;
				//每部分所占比重
				var textScale=this.drawData[i].amount/this.allData;
				
				//将坐标原点移动到绘制文本处（根据圆心进行计算）
				context.translate(150+110*Math.cos(textAngle),150+110*Math.sin(textAngle));
				//旋转文本
				context.rotate(textAngle+Math.PI*1/2);
				context.fillStyle=this.setting.frontColor.color;
				context.font=this.setting.frontColor.font;				
				context.fillText(this.drawData[i].name,-20,0);
				
				//恢复到保存点
				context.restore();				
				startPoint -= Math.PI*2*(this.drawData[i].amount/this.allData); 
			}
			
		}
		,drawColumnar:function(){	//绘制柱状图标
			var context=this.$element.get(0).getContext("2d");
			//绘制坐标系
			this.drawCoordinateSystem(context);		
			
			var width=20;
			var margin=20;
			
			for(var i=0;i<this.drawData.length;i++){  
				context.fillStyle = this.setting.bgColor[i].drawColor;  
				context.strokeStyle = this.setting.bgColor[i].drawColor;
				//计算绘制的矩形的左上角的x,y坐标(以绘制的x坐标轴为参考基准）
				var x=40+(width+margin)*i;
				var y=260-260*(this.drawData[i].amount/this.allData);
				//绘制圆柱
				context.fillRect(x,y,width,260*(this.drawData[i].amount/this.allData));
				//绘制文本内容
				context.fillStyle=this.setting.frontColor.color;
				context.font=this.setting.frontColor.font;
				context.fillText(this.drawData[i].name,x,280);
			}
		}
		,drawFoldLine:function(){	//绘制折线			
			var padding=50;
			var context=this.$element.get(0).getContext("2d");
			//绘制坐标系
			this.drawCoordinateSystem(context);
			context.beginPath();
			context.moveTo(20,260);
			for(var i=0;i<this.drawData.length;i++){  
				//计算折线点的坐标
				var x=40+padding*i;
				var y=260-260*(this.drawData[i].amount/this.allData);
				context.setLineDash([5, 5]);//设置绘制线段的样式为虚线
				context.lineTo(x,y);
				context.stroke();
				context.fillStyle="gray";
				context.fillRect(x,y,1,260*(this.drawData[i].amount/this.allData));
				context.fillStyle=this.setting.frontColor.color;
				context.font=this.setting.frontColor.font;
				context.fillText(this.drawData[i].name,x-10,280);
			}
		}
		,drawCoordinateSystem:function(context){	//绘制坐标系
			context.moveTo(20,20);
			context.lineTo(20,260);
			context.lineTo(260,260);
			
			context.strokeStyle="black";
			context.lineWidth=2;
			context.stroke();  			
		}
		,countData:function(){	//统计数据的总量
			var allData=0;
			for(var i=0;i<this.drawData.length;i++){
				allData+=this.drawData[i].amount;
			}
			this.allData=allData;
		}
	};
	//在插件中使用DataList对象
    $.fn.drawChart = function(data,options,drawType) {
        //创建DataList的实体
        var dataDrawer = new DataDrawer(this, data,options);
		console.log(dataDrawer.drawData);
        //调用其方法
		dataDrawer.countData();
		if("PieChart"==drawType){
			return dataDrawer.drawPieChart();
		}else if("Columnar"==drawType){
			return dataDrawer.drawColumnar();
		}else if("FoldLine"==drawType){
			return dataDrawer.drawFoldLine();
		}       
    }
})(jQuery,window,document);
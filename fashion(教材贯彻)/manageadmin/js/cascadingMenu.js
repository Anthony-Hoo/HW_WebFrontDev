// JavaScript Document
// Created by guoqy
;(function($,window,document,undefined){
	//默认参数
	var defaults=[{
			"text":"男装",
			"value":"男装",
			"subType":[{"value":"西装","text":"西装"},
				{"value":"风衣","text":"风衣"},
				{"value":"夹克","text":"夹克"}]
		},{
			"text":"女装",
			"value":"女装",
			"subType":[{"value":"女士上衣","text":"女士上衣"},
				{"value":"女士裙装","text":"女士裙装"},
				{"value":"蕾丝外衣","text":"蕾丝外衣"}]
		},{
			"text": "童装",
			"value": "童装",
			"subType": [{"value":"卡通系列","text":"卡通系列"},
				{"value":"卡哇伊系列","text":"卡哇伊系列"},
				{"value":"运动系列","text":"运动系列"}]
		}];
	//构造方法
	function CascadingMenu(element,options){
		this.$element=element;
		this.settings=$.extend(defaults,options);
		this.firstMenu=null;
		this.secondMenu=null;
	}
	//添加属性或方法
	CascadingMenu.prototype={
		initMenu:function(){
			this.initFirstMenu();
			this.bindSelectChangeEvent();
			//将firstMenu和secondMenu添加到指定的标签中
			return $(this.$element).append(this.firstMenu)
					.append(this.secondMenu);
		},
		initFirstMenu:function(){
			this.firstMenu=$("<select></select>");//创建级联菜单的第一项
			this.firstMenu.append($("<option value='请选择'>-请选择-</option>"))
			//为select添加option项
			for(var i=0;i<this.settings.length;i++){
				var option=$("<option></option>");
				option.append(this.settings[i].text);//设置option的显示内容
				option.val(this.settings[i].value);//设置option的value值
				this.firstMenu.append(option);//将option添加到firstMenu中
			}
			return this.firstMenu;
		},
		bindSelectChangeEvent:function(){
			var that=this;//保存this对象
			that.secondMenu=$("<select></select>");
			that.secondMenu.append($("<option value='请选择'>-请选择-</option>"));
			//设置一级菜单的onChange事件处理函数
			that.firstMenu.on("change",function(){
				//一级菜单发生改变时，二级菜单进行清空
				that.secondMenu.empty();
				//为二级菜单添加第一项“请选择”
				that.secondMenu.append($("<option value='请选择'>-请选择-</option>"));
				//获得一级菜单被选项的索引
				//（因下标从1开始，而数组下标从0开始；数组一致故需要减1）
				var index=this.selectedIndex-1;
				//一级菜单对应的子菜单类型
				var subType=that.settings[index].subType;
				for(var i=0;i<subType.length;i++){
					var option=$("<option></option>");
					option.append(subType[i].text);//设置option的显示内容
					option.val(subType[i].value);//设置option的value值
					that.secondMenu.append(option);//将option添加到secondMenu中
				}
			});
			return that.secondMenu;
		}
	};
	//在自定义插件cascadingMenuPlugins中创建cascadingMenu对象
	$.fn.cascadingMenuPlugins=function(opts){
		console.log(opts);
		var cascadingMenu=new CascadingMenu(this,opts);
		return cascadingMenu.initMenu();
	}
})(jQuery,window,document);

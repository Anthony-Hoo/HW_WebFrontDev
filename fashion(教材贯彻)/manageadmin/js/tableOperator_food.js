// JavaScript Document
// author by guoqy
//定义餐品的类型
var foodTypeArray=[{text:"烤肉",value:"烤肉"},{text:"韩国料理",value:"韩国料理"},
				{text:"日本料理",value:"日本料理"},{text:"中餐",value:"中餐"},{text:"自助餐",value:"自助餐"}];
var foodStatusArray=[{text:"已审核",value:"已审核"},{text:"未审核",value:"未审核"}];

$(function(){

	//为所有的行中的删除链接添加事件处理（此方式可以在新增元素上绑定事件）
	$(".imgtable").on("click",".tablelink:contains('删除')",function(e){
        $(this).parent().parent().remove();
    });

	//点击添加按钮，为表格添加一行
	$(".toolbar>li:first").on("click", function(e){	
        var tableList=$(".imgtable").append('<tr><td><input name="foods" type="checkbox" value=""/></td><td class="imgtd"><img src="images/nopic.gif" height="75px" width="100px" /><br/><input type="file"/></td><td><input type="text" value="请输入餐品名称"/></td><td><input type="text" value="请输入门市价"/></td><td><input type="text" value="请输入团购价"/></td><td><select></select></td><td><select></select></td><td><input type="date"/></td><td><a href="#" class="tablelink">确定</a> <a href="#" class="tablelink">删除</a></td></tr>');		
		//设定新添加元素的样式
		tableList.find("input[type='file']").css({margin:"10px 10px 10px 0px",width:"120px"});
		tableList.find("input[type='text']").css({border:"1px solid black",height:"20px",backgroundColor:"#FF9"});
		tableList.find("input[type='text']:gt(0)").css({width:"80px"});
		tableList.find("input[type='date']").css({border:"1px solid black",height:"20px",backgroundColor:"#FF9"});
		//为日期赋予初始值
		tableList.find("input[type='date']").val(getNowTime());
		//对下拉列表进行初始化
		initSelect(tableList.find("select:first"),foodTypeArray);
		initSelect(tableList.find("select:last"),foodStatusArray);
    });	
	//为文本框添加focus焦点事件，获得焦点时清空文本框内容
	$(".imgtable").on("focus","input[type='text']",function (e) {
        $(this).val("");
    });
	//选取文件时，显示本地文件（使用HTML5中的FileAPI，读者可以自行查阅相关文档）
	$(".imgtable").on("change","input[type='file']",function (e) {
		var that=this;
        var file=$(".imgtable input[type='file']")[0];
		 if(window.FileReader) {  
                var fr = new FileReader();  
                fr.onloadend = function(e) {  
                    $(that).prev().prev().attr("src",e.target.result); 					
                };  
                fr.readAsDataURL(file.files[0]);  
            }  
    });

	//点击新增行的"确定"按钮时，触发的事件
	$(".imgtable").on("click",".tablelink:contains('确定')",function (e) {
		var tableRow=$('<tr><td><input name="foods" type="checkbox" value=""/></td></tr>');
		var foodsImage=$(".imgtable input[type='file']")[0];
		//FireFox、Chrome等浏览器浏览器安全性要求相对比较高，返回的路径实际为C:\fakepath\xx.jpg
		if(foodsImage.value!=""&&foodsImage.value.indexOf("fakepath")==-1){
			//浏览器安全性方面要求不允许直接读取本地文件，此处仅作演示（IE11，支持，其他浏览器不支持）
			//具体在实际情况下，需要使用Ajax结合服务器来实现
			tableRow.append("<td><img src='"+foodsImage.value+"' /></td>'");
		}else{
			tableRow.append("<td><img src='images/nopic.gif' /></td>'");
		}
		var currentRowInput=$(this).parent().parent().find("input[type='text']");
		tableRow.append("<td>"+currentRowInput[0].value+"</td>'");
		
		var storePrice=0;
		if(currentRowInput[1].value!="请输入门市价"){
			storePrice=currentRowInput[1].value;
		}
		tableRow.append("<td>￥"+storePrice+"</td>'");
		var groupPrice=0;
		if(currentRowInput[2].value!="请输入团购价"){
			groupPrice=currentRowInput[2].value;
		}
		tableRow.append("<td>￥"+groupPrice+"</td>'");
		
		var foodsType=$(this).parent().parent().find("select:first")[0];		
		tableRow.append("<td>"+foodsType.value+"</td>'");		
		
		var isChecked=$(this).parent().parent().find("select:last").val();
		tableRow.append("<td>"+isChecked+"</td>");	
		
		var publishTime=$(this).parent().parent().find("input[type='date']");
		tableRow.append("<td>"+publishTime[0].value+"</td>");	
		tableRow.append('<td><a href="#" class="tablelink">查看</a> <a href="#" class="tablelink">删除</a></td>');
		
		tableRow.find("td:contains('￥')").wrapInner("<span class='orange14'></span>").append("元");
		tableRow.find("td:contains('未审核')").wrapInner("<i></i>");
		
		//移除编辑行
        var tr=$(this).parent().parent().remove();
		$(".imgtable tbody").append(tableRow);
		$(".imgtable td img").css({width:"80px",height:"60px"});
    });	
	
	//编辑功能
	$(".toolbar>li:eq(1)").on("click", function (e) {	
		var selectedCheckBox = $(".imgtable tbody :checked");
		if(selectedCheckBox.size()==0){
			alert("请选择需要被编辑的行!");
			return;
		}
        for (var i = 0; i < selectedCheckBox.length; i++) {
            editTableRow(selectedCheckBox.eq(i));
        }
	});
	
});
//编辑表格中的行
function editTableRow(selectedCheckBox){
	 var currentRow = $(selectedCheckBox).parent().parent();
	 var backupCurrentRow=currentRow.html();
	 //获得当前行中所有的单元格
	 var editingCells = currentRow.find("td");
	 //1.将餐品标题改为可编辑状态
	 var foodTitleCell = editingCells.eq(2);
	 var foodTitle = $("<textarea></textarea>").val(foodTitleCell.text()).css({width:"270px",height:"80px"});
     foodTitleCell.empty().append(foodTitle);
	 //2.将餐品门市价改为可编辑状态
	 var foodStorePriceCell = editingCells.eq(3);
	 var foodStorePrice=$("<input type='text' />")
	 	.val(foodStorePriceCell.find("span").text().substring(1))
	 	.css({border:"1px solid black",height:"20px",backgroundColor:"#FF9"});
	 foodStorePriceCell.empty().append(foodStorePrice);
	 //3.将餐品的团购价改为可编辑状态
	 var foodGroupPriceCell = editingCells.eq(4);
	 var foodGroupPrice=$("<input type='text' />")
	 	.val(foodGroupPriceCell.find("span").text().substring(1))
	 	.css({border:"1px solid black",height:"20px",backgroundColor:"#FF9"});
	 foodGroupPriceCell.empty().append(foodGroupPrice);
	 //4.将餐品类型改为可编辑状态
	 var foodTypeCell = editingCells.eq(5);
	 var foodType=initSelect($("<select></select"),foodTypeArray).val(foodTypeCell.text());
	 foodTypeCell.empty().append(foodType);
	 //5.将审核类型改为可编辑状态
	 var foodStatusCell=editingCells.eq(6);
	 var foodStatus=initSelect($("<select></select"),foodStatusArray).val(foodStatusCell.text());
	 foodStatusCell.empty().append(foodStatus);
	 //6.将发布日期改为可编辑状态
	 var publishTimeCell=editingCells.eq(7);
	 var publishTime=$("<input type='date' />")
		.val(publishTimeCell.text())
	 	.css({border:"1px solid black",height:"20px",backgroundColor:"#FF9"});
	 publishTimeCell.empty().append(publishTime);
	 //7.操作类型进行改变
	 var operatorCell=editingCells.eq(8);
	 var operator1=$('<a href="#" class="tablelink">编辑 </a>');
	 var operator2=$('<a href="#" class="tablelink">取消</a>');
	 operatorCell.empty().append(operator1).append(operator2);
	 //绑定取消事件处理函数
	 $(operator2).on("click",operator2,function(e){
		 currentRow.html(backupCurrentRow);
	 });
	 $(operator1).on("click",operator1,function(e){
		 var editingCells = currentRow.find("td");
		 //将餐品标题从编辑状态改为不可编辑状态		 
		 editingCells.eq(2).empty().append(foodTitle.val())
			 .wrapInner("<p class='intro_width'></p>");
		 
		 editingCells.eq(3).empty().append(foodStorePrice.val()).prepend("￥")
		 	.wrapInner("<span class='orange14'></span>").append("元");
		 editingCells.eq(4).empty().append(foodGroupPrice.val()).prepend("￥")
		 	.wrapInner("<span class='orange14'></span>").append("元");
		 editingCells.eq(5).empty().append(foodType.val());
		 editingCells.eq(6).empty().append(foodStatus.val());
		 editingCells.eq(7).empty().append(publishTime.val());
		 editingCells.eq(8).empty()
		 	.append('<a href="#" class="tablelink">查看</a> <a href="#" class="tablelink">删除</a>');		
	 });
};



//获取系统当前时间（年月日）
function getNowTime(){
	var now=new Date();
	return now.getFullYear()+'-'+fixedNumber(now.getMonth())+"-"+fixedNumber(now.getDate());
}
//对数字进行修正
function fixedNumber(num){
	if(num<10){
		return "0"+num;	
	}
	return num;
}
//对下拉列表添加下拉选项
function initSelect(element,data){
	//为select添加option项
	for(var i=0;i<data.length;i++){
		var option=$("<option></option>");
		option.append(data[i].text);//设置option的显示内容
		option.val(data[i].value);//设置option的value值
		$(element).append(option);//将option添加到firstMenu中
	}
	return $(element);
}
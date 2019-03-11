// Created by guoqy
//元素获取焦点时触发该函数
function onFoucs(){
	this.select();
	this.style.backgroundColor="#FFEC8B";
	this.style.color="#000000";
}
//元素失去焦点时触发该函数
function onBlur(){
	this.style.backgroundColor="#FFFFFF";
	this.style.color="#000000";
}
//验证用户名是否有效
function checkUserName(){
	var userName=document.getElementById("userName");
	if(userName.value==""||userName.value=="请输入用户名")	{
		alert("用户名不能为空");
		userName.focus();
		return false;
	}
}
//验证密码和确认密码是否有效
function checkPassword(){
	var userPwd=document.getElementById("userPwd").value;
	var userRePwd=document.getElementById("userRePwd").value;
	if(userPwd==""){
		alert("密码不能为空！");
		return false;
	}else if(userPwd.length<6||userPwd.length>20){
		alert("密码长度为6~20位，请进行确认！");
		return false;
	}else if(userPwd!=userRePwd){
		alert("新密码和确认密码不一致！");
		return false;
	}
	//密码由字母、数字和符号的两种以上组合
	if(/\d/.test(userPwd)&&/[a-z]/i.test(userPwd)||
		/\d/.test(userPwd)&&/[\@\#\$\%\&\*]/.test(userPwd)||
		/[\@\#\$\%\&\*]/.test(userPwd)&&/[a-z]/i.test(userPwd)){
		return true;	
	}else{
		alert("密码必须是由字母、数字和符号的两种以上组合!");
		return false;	
	}
	return false;	
}
//其他表单验证不再提供，读者可自行实现...
//表单提交时，触发该函数
function checkForm(){
	return checkUserName()&&checkPassword();	
}
/*//窗口加载完毕时，完成事件绑定
window.onload = function () {
	//为表单绑定表单提交事件处理函数
	var myform=document.forms[0];
	myform.onsubmit=checkForm;
	//为输入文本框绑定onfocus和onblur事件处理函数
	var inputs=document.getElementsByTagName("input");
	for(var i=0;i<inputs.length;i++){
		var type=inputs[i].type;
		if(type=="text"||type=="password"){
			inputs[i].onfocus=onFoucs;
			inputs[i].onblur=onBlur;
		}
	}
};*/
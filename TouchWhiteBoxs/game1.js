//创建四行，并将第一行隐藏
var row = new Array;//储存每个row
var flag = true;
var score = 0,interval = 500,period = 20;
function prepareIcon() {
	
	var iconBoard = document.getElementById("icon");
	for(var i = 0; i <4; i++) {
		row[i] = document.createElement("div");
		row[i].className = "row";//怎样用js给元素的class赋值
		row[i].innerHTML = "<div></div><div></div><div></div><div></div>"
		addClassname(row[i]);
		iconBoard.appendChild(row[i]);
	}
}
//给row中的div随机添加blackcell classname
function addClassname(elem) {
	var boxs = elem.getElementsByTagName("div");
	var blackIndex = Math.ceil(Math.random()*4);
	var len = boxs.length;
	for(var i = 1; i <= len; i++) {
		boxs[i-1].className = "cell";
	}
	boxs[blackIndex-1].className = "blackcell";
}
//绑定加速事件
function moveSpeed() {
	var fast = document.getElementById("fast");
	var slow = document.getElementById("slow");
	fast.addEventListener("click",function() {
		showSpeed();
		if(interval > 100 && period >2) {
			interval -= 100;	
			//period -= 2;
		} else {
			interval = 100;
			//period = 2;
		}
		
	});
	slow.addEventListener("click",function() {
		showSpeed();
		if(interval < 1000 && period < 40) {
			interval += 100;
			//period += 2;
		} else {
			interval = 1000;
			//period = 40;
		}
		
	})
}
//一个计时器，让icon缓慢向下移动
function moveIcon() {
	if(!flag) {
		return;
	}
	var elem = document.getElementById("icon");
	if(elem.movement) {
		clearTimeout(elem.movement);
	}
	var top = window.getComputedStyle(elem).getPropertyValue("top");//是否有更好的方法获得外部样式表的属性值
	var distance = top.slice(0,-2);//是一个负值
	distance = parseInt(distance);
	var target = 0;
	if(distance === target) {
		gameOver();
		return;
	} else {
		distance += Math.ceil((target-distance)/period);
	}
	elem.style.top = distance + "px";
	elem.movement = setTimeout("moveIcon()",interval);//延迟调用
}
//moveIcon最多只能下移100px；当下降完一个方块的高度后再创建
function createNewRow() {
	var iconBoard = document.getElementById("icon");
	var top = window.getComputedStyle(iconBoard).getPropertyValue("top");
	var topValue = top.slice(0,-2);

	topValue = parseInt(topValue) - 100;//每点击一次就增加top值
	iconBoard.style.top = topValue + "px";
	var newRow = document.createElement("div");
	newRow.className = "row";
	newRow.innerHTML = "<div></div><div></div><div></div><div></div>";
	addClassname(newRow);
	iconBoard.insertBefore(newRow,iconBoard.firstChild);
	var boxs = newRow.getElementsByTagName("div");
	for(var i = 0;i < 4; i++) {
		boxs[i].addEventListener("click",function(event) {
			var clickTarget = event.target;
			if(clickTarget.className === "blackcell") {
				score++;
				showScores();
				deleteRow(clickTarget);
				createNewRow();
			} else {
				gameOver();
			}
		})
	}
}
//初始化icon
function refreshIcon() {
	var elem = document.getElementById("icon"); 
	elem.style.top.textNode = "-100px";
}
//给黑白块绑定判断事件
function judgeBoxs() {
	var len1 = row.length;
	for(var i = 0; i < len1; i++) {//相当于只给行的方块绑定了事件。
		var boxs = row[i].getElementsByTagName("div");
		var len2 = boxs.length;
		for(var j = 0; j < len2; j++) {
			boxs[j].addEventListener("click",function(event) {
				var clickTarget = event.target;
				if(clickTarget.className === "blackcell") {
					//删除改行，得分加一。
					score++;
					showScores();
					deleteRow(clickTarget);//每次删除一行后，需要重新给row遍历
					createNewRow();
				} else {
					//结束游戏
					gameOver();
				}
			});
		}
	}
}
//点击黑块的时候，删除该行的事件
function deleteRow(box) {
	var boxParent = box.parentNode;
	var iconBoard = document.getElementById("icon");

	iconBoard.removeChild(boxParent) ;

}
function changeStyle(elem) {
	elem.style.height = "400px";
	elem.style.width = "400px";
	elem.style.fontSize = "30px";
	elem.style.backgroundColor = "red";
	elem.style.fontWeight = "bold";
	elem.style.textAlign = "center";
	elem.innerHTML = "游戏结束";
	elem.style.cssFloat = "left";
}
function gameOver() {
	flag = false;
	var mainBoard = document.getElementById("main");
	var iconBoard = document.getElementById("icon");
	var warning = document.createElement("div");
	changeStyle(warning);
	mainBoard.removeChild(iconBoard);
	mainBoard.appendChild(warning);
	return flag;	
}
//显示分数
function showScores() {
	var scoreBoard = document.getElementById("score");
	scoreBoard.innerHTML = score;
}
function showSpeed() {
	var speedBoard = document.getElementById("speed");
	speedBoard.innerHTML = interval;
}
function init() {
	showSpeed();
	moveSpeed();
	prepareIcon()
	refreshIcon();
	moveIcon();
	judgeBoxs();

}
init();
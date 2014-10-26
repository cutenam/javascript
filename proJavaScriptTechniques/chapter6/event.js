/*
*	자바스크립트 이벤트에 대한 소개
*		- 어떤 자바스크립트 코드라도 그 핵심부를 살펴보면,
*			바로 이벤트가 모든 것을 한데 묶는 접착제 같음을 깨닫게 될 것이다.
*		(1) 비동기식 이벤트 vs. 스레드
*			- 자바스크립트 이벤트 시스템은 조금 독특하다. 스레드를 사용하지 않으면서 완벽히 비동기식으로 동작한다.
*			- 이는 곧 애플리케이션의 모든 코드가, 사용자의 클릭이나 페이지 로딩 등에 대해서도 반응할 수 있음을 뜻한다.
*			- 스레드 프로그램과 비동기식 프로그램의 설계에는 근본적인 차이가 있다. 바로 어떤 사건이 발생하기를 기다리는 방식의 차이이다.
*			- 스레드 프로그램의 경우, 특정 조건이 맞는지 계속해서 확인하고 또 확인해야 한다.
*			- 비동기식 프로그램에서는 그저 이벤트 처리기를 콜백 함수로 등록해놓고, 이벤트가 발생하면 언제라도 그 처리기가 콜백 함수를 바로 실행함으로서 이벤트의 발생을 알려준다.
*		(2) 자바스크립트 스레드
*			- 자바스크립트에는 스레드가 존재하지 않는다.
*			- 스레드에 가장 근접한 것이라면 setTimeout() 콜백을 사용하는 방법이겠지만, 완전하지는 않다.
*		(3) 비동기식 콜백
*			- 어떤 DOM엘리먼트가 있고, 특정 타입의 이벤트가 이 엘리먼트에 대해 언제라도 호출될 수 있다면, 이를 처리하기 위해 호출할 함수가 필요함
*			- 원하는 시점에 실행될 코드에 대한 참조를 제공함
*			- 나머지 작업은 브라우저가 대신 해줌
*			- 이벤트 처리기에 콜백을 등록해둠
*			- 이벤트가 일어나는 순서가 변할 수 있으며, 이벤트의 타입에 따라 또는 그 이벤트가 일어나는 DOM 엘리먼트에 따라 다른 방식으로 처리될 수 있음

*/
/*
*	스레드를 흉내 내는 가상의 자바스크립트 코드
*		- 이 코드는 페이지가 완전히 로딩되기를 기다리는 가상의 코드다.
*		- window.loaded() 가 true 를 반환하는지 아닌지를 계속 확인하는 루프
*		- 자바스크립트의 모든 루프는 블로킹 방식이기 때문에 루프가 끝날 때 까지는 다른 어떤 것도 발생할 수 없다.
*		- 실제로 while 루프가 계속 실행되는 동안에는 애플리케이션의 정상적인 흐름이 막히기 때문에 절대로 true 값에 도달할 수 없다
*/
// 페이지가 로딩되기를 기다리며 계속하여 확인함
// while(!window.loaded()) {
	
//}
// 이제 페이지가 로딩되었으니 무언가 일을 시작한다.
// document.getElementById("body").style.border = "1px solid #000";

/*
*	자바스크립트의 비동기식 콜백
*		- 이벤트 처리기와 콜백을 사용하는 예
*		- 지금 즉시 실행되는 코드는 단지 이벤트 처리기(호출한 함수) 를 이벤트 리스너(onload 프로퍼티) 에 연결하는 부분임
*		- 페이지가 완전히 로딩되면 브라우저가 window.load에 연결된 함수를 호출하고 실행함
*/
// 페이지가 로딩될 때마다 호출할 함수를 등록한다.
//window.onload = loaded;  // loaded() 는 함수 실행 결과가 등록됨

// 페이지가 로딩될 때마다 호출할 함수
function loaded() {
	// 이제 페이지가 로딩되었으니 필요한 작업을 시작한다.
	document.getElementsByTagName("body")[0].style.border = "1px solid #000";
//	document.getElementById("body").style.border = "1px solid #000";
}
/*
*	이벤트 단계
*		- 자바스크립트 이벤트는 "캡쳐(capturing)" 와 "버블(bubbling)" 이라는 두 단계에 걸쳐 실행된다.
*		- 즉 어떤 엘리먼트에서 이벤트가 발생하면 이 이벤트를 처리할 권한을 가지는 엘리먼트나 이 이벤트를 처리하는 순서가 경우에 따라 바뀔 수 있다.
*		(1) 캡쳐 단계
*			- 이벤트가 발생한 요소까지 document 에서부터 이벤트 처리기가 구동된다
*		(2) 버블 단계
*			- 요소 트리를 역순으로 거슬러 올라가면서 이벤트 처리기가 구동된다.
*/
/* 마우스 호버(hover) 효과를 내는 탭(tab) 탐색 시나리오
*	-모든 li 엘리먼트를 찾아서 이벤트 처리기를 붙인다.
*	- li 위에 마우스를 올릴 때마다 실제로는 서로 다른 두 개의 엘리먼트를 전환시키고 있다.
*		li 엘리먼트는 a엘리먼트를 포함하고 있으므로 마우스를 올릴 때는 단지 li 만이 아니라, a 엘리먼트 위에도 올리는 셈이다.
*/
/*
var li = document.getElementsByTagName("li");
for (var i=0; i < li.length; i++) {
	// li 엘리먼트에 mouseover 처리기를 붙인다.
	// 이 처리기는 li 의 배경색을 파란색으로 바꾼다.
	li[i].onmouseover = function() {
		this.style.backgroundColor = "blue";
	};

	// li 엘리먼트에 mouseout 처리기를 붙인다
	// 이 처리기는 li 의 배경색을 원래의 흰색으로 되돌린다.
	li[i].onmouseout = function() {
		this.style.backgroundColor = "white";
	};
}
*/
/*
*	이벤트가 호출되는 정확한 과정
*		(1) li mouseover : li 엘리먼트 위로 마우스를 움직인다.
*		(2) li mouseout :  li 로부터 그 안에 있는 a 로 마우스를 움직인다.
*		(3) a mouseover : 이제 a 엘리먼트 위에 마우스가 놓여있다.
*		(4) li mouseover : a mouseover 이벤트가 솟아올라(bubbles up) li mouseover 를 발생시킨다.
*
*		- 위 단계에서는 이벤트 캡쳐 단계가 무시되어 있음
* 		-  이벤트 리스너를 연결하는 데 오래된, 전통적인 방법, 즉 어떤 엘리먼트의 onevent 의 프로퍼티를 설정함으로서 이벤트를 연결하는 방법은
*			이벤트의 버블 단계만을 지원할 뿐, 캡쳐 단계는 지원하지 않는다.
*
*		- li 엘리먼트에서는 mouseout 이 일어나고 a 에서 li 로 mouseover 이벤트가 솟아오르는 과정
*		(1) mouseout 이벤트가 일어나는 이유는, 브라우저의 관점에서는 부모 엘리먼트인 li의 영역을 떠나, 또 다른 엘리먼트에 진입했다고 간주하기 때문
*			- 어떤 엘리먼트이든 그 아래에 위치한 다른 엘리먼트보다 그 위에 있는 엘리먼트가 먼저 마우스 포커스를 받는다.
*		(2) a mouseover 이벤트가 그 부모인 li 엘리먼트로 솟아오른 덕분에 코드를 절약할 수 있다.
*			- a 엘리먼트에는 어떤 이벤트 리스너도 연결하지 않았기 때문에 이벤트는 그저 DOM 트리를 따라 올라가면서 이벤트에 귀기울이고 있는 다른 엘리먼트를 찾는다.
*			- 이러한 버블 단계에서 제일 먼저 만나는 엘리먼트가 바로 li 엘리먼트, 즉 mouseover 이벤트가 들어오기를 기다리고 있는 엘리먼트임
*			- 만일, a 엘리먼트의 mouseover 엘리먼트에 이벤트 리스너를 연결해 두었다면, 이벤트의 버블과정을 멈출 수 있는 방법을 구현해야 함
*/

/*
*	이벤트 객체
*		- 이벤트 처리기의 기본적인 기능 중 하나는 바로 이벤트 객체에 접근할 수 있게 해줌
*		- 이벤트 객체는 현재 이벤트에 대한 상황정보들이 담겨 있는 자원임
*		- 예를 들어, 키보드 누름을 다루고자 할 때 이벤트 객체의 keyCode 프로퍼티에 접근함으로서 방금 눌린 특정 키를 알아낼 수 있음
*		- 이벤트 객체에 대한 구현은 IE 와 W3C 명세가 다름
*		- IE : 단 하나의 전역 이벤트 객체만 존재한다 (이 객체는 전역 변수 프로퍼티인 window.event 에서 찾을 수 있음)
*		- 그 외 브라우저 : 이벤트 처리기에서 이벤트 객체를 담고 있는 전달인자 하나를 받음
*		
*		- 이벤트 객체에서는 수많은 어트리뷰트와 함수가 존재한다.
*		- 그 명칭이나 작동 방식은 브라우저에 따라 다르다.
*/
// DOM 이벤트를 사용하여 기존 기능을 덮어쓰기
// 이벤트 객체를 범용적으로 사용하는 예
// 페이지의 첫째 textarea 를 찾고, keypress 리스너를 연결한다.
// textarea 안에서 Enter 키를 치면 일반적으로 새로운 줄바꿈이 생기는데, 이 기본 기능을 막음
/*
document.getElementsByTagName("textarea")[0].onkeypress = function(e) {
	// 만일 이벤트 객체가 존재하지 않는다면 전역의 이벤트 객체를 선택한다.(IE)
	e = e || window.event;

	console.log(e);
	// Enter 키가 눌렸을 때 false 를 반환한다.(아무일도 하지 않는다.)
	console.log(e.keyCode);
	return e.keyCode !== 13;
}
*/

/*
*	this 키워드
*		- this 키워드는 함수의 유효범위 내에서 현재 객체에 접근하기 위한 수단으로 쓰인다.
*		- 최신 브라우저에서는 this 키워드를 통하여 모든 이벤트 처리기에 모종의 상황정보를 전달한다.
*		- 예를 들어, 클릭을 다루는 일반 함수를 생성하는데 this 키워드 만을 사용함으로서 어떤 엘리먼트가 현재 영향 받고 있는지 알아 낸다.
*		- this 키워드는 편리함을 사용할 뿐이지, 그 이상도 이하도 아니다. 
*			this 키워드를 적절히 사용하면 자바스크립트 코드를 훨씬 더 간단하게 작성할 수 있다.
*/
// 페이지 내의 모든 클릭된 li 엘리먼트에 대해 배경색과 전경색을 변경한다.
// 모든 li 엘리먼트를 찾고 각각에 click 처리기를 연결한다.

/*
var li2 = document.getElementsByTagName("li");

for(var i=0; i < li2.length; i++) {
	li2[i].onclick = handleClick;
}

// click 처리기 - 호출되면 지정된 엘리먼트의 배경색과 전경색을 변경한다.
function handleClick() {
	this.style.backgroundColor = "blue";
	this.style.color = "white";
}
*/

/*
*	이벤트 버블 취소하기
*		- 이벤트 제어 하는 방법
*		- 만일 이벤트가 오직 그 대상에서만 발생할 뿐 그 부모로는 더 이상 전파되지 않기를 원한다 하더라도, 그 과정을 멈출 방법이 없다.
*		- 이벤트의 버블 (또는 캡쳐) 을 멈추는 것은 복잡한 애플리케이션에서 정말 유용하게 쓰일 수 있다.
*		- IE 에서는 이벤트의 버믈 과정을 멈추기 위한 방법이 그 외의 모든 브라우저와는 다른 형태로 제공된다.
*		
*		- 이벤트 버블 과정을 취소해야하는 경우
*			동적 애플리케이션을 개발하려 할때 (키보드나 마우스 이벤트를 다루는 애플리케이션)
*/
// 이벤트 버믈 과정을 취소할 수 있는 일반적인 함수
// 이 함수는 이벤트 버믈 과정을 취소하는 과정을 하나는 표준 W3C 방식과 다른 하나는 IE 의 비표준 방식으로 다룬다.
function stopBubble(e) {
	// 이벤트 객체가 제공되었다면, 이는 IE 가 아닌 브라우저이다.
	if(e) {
		// 그러므로 여기서는 W3C의 stopPropagation() 메서드가 지원된다.
		e.stopPropagation();
	} else {
		//그렇지 않다면, 이벤트 버블 과정을 취소하기 위해 IE 방식을 사용해야 한다.
		window.event.cancelBubble = true;
	}
}

// 마우스가 올려진 엘리먼트 주변에 빨간 테두리를 추가하는 함수
// 모든 DOM 엘리먼트에 mouseover와 mouseout 이벤트 처리기를 추가했다.
// 만약 이벤트 버블을 취소하지 않는다면, 마우스를 어떤 엘리먼트 위에 올릴 때마다 해당 엘리먼트 뿐 아니라, 그 부모 엘리먼트의 주변에도 빨간 테두리가 추가된다.
// stopBubble() 을 사용해서 상호 작용이 가능한 엘리먼트들을 생성하기
// DOM 에 있는 모든 엘리먼트를 찾으면서 탐색한다.
/*
var all = document.getElementsByTagName("*");
for (var i=0; i<all.length; i++) {
	// 사용자가 어떤 엘리먼트 위로 마우스를 움직이기를 기다렸다가
	// 그 엘리먼트 둘레에 빨간 테두리를 추가한다.
	all[i].onmouseover = function(e) {
		this.style.border = "1px solid red";
		stopBubble(e);
	};
	
	// 사용자가 엘리먼트 바깥으로 마우스를 치우기를 기다렸다가 
	// 아까 추가했던 테두리를 제거한다.
	all[i].onmouseout = function(e) {
		this.style.border = "0px";
		stopBubble(e);
	};
}
*/

/*
*	브라우저의 기본 동작을 덮어쓰기
*		- 대부분의 이벤트가 발생할 때 브라우저에는 언제나 그에 따라 실행되는 기본 동작이 있다.
*			예를 들어, a  엘리먼트를 클릭하면 브라우저는 연결된 웹페이지로 이동한다. 이 동작은 이벤트 캡처와 버블 단계 이후에 항상 살행된다.
*		- 이벤트는 캡처와 버블 단계에서 DOM 을 탐색해나가면서 시작된다. 
*			하지만 일단 이벤트의 탐색 과정이 완료되면 브라우저가 해당 이벤트와 엘리먼트에 대해 기본 동작을 실행시키려 한다. 
*		- 기본 동작이란 브라우저가 해주는 모든 동작이라고 요약할 수 있다.
*			(1) a 엘리먼트를 클릭하면 그 엘리먼트의 href 어트리뷰트에 명시된 URL 로 이동한다.
*			(2) 키보드의 Ctrl+S 를 누르면 현재 사이트의 표현을 브라우저가 저장하려 한다.
*			(3) HTML form 을 제출하면 지정된 URL 에 질의 데이터를 제출하고 그 주소로 브라우저가 이동한다.
*			(4) alt 또는 title 어트리뷰트(브라우저에 따라 다름) 가 있는 img 위로 마우스를 이동시키면 툴팁이 나타나면서 그 img 에 대한 설명을 제공한다.
*		- 이벤트 버블 과정을 중단하거나 연결된 이벤트 처리기가 없다하더라도 브라우저는 위에서 나열한 동작들을 실행한다.
*		- 이벤트 버블 과정을 취소하는 것만으로는 기본 동작을 막을 수 없기 때문에 이를 직접 처리할 수 있는 특별한 코드가 필요하다.
*		- 기본 동작이 일어나는 것을 막는 2가지 방법
*			(1) IE 전용 방식
*			(2) W3C 방식
*/
// 브라우저의 기본 동작이 발생하는 것을 막는 일반 함수
/*
*	- 이 함수는 단 하나의 전달 인자, 즉 이벤트 처리기에 전달된 이벤트 객체를 받는다. 
*	- 이 함수는 이벤트 처리기의 맨 마지막에 사용되어야만 한다.(return stopDefault(e) 와 같이) 
*		왜냐하면 이벤트 처리기 역시 false 를 반환해야 하기 때문이다.
*/
function stopDefault(e) {
	// 브라우저의 기본 동작을 막는다.(W3C)
	if (e && e.preventDefault) {
		e.preventDefault();
	} else {
		// IE 에서 브라우저의 동작을 중지시키는 간단한 방법
		window.event.returnValue = false;
	}
	
	return false;
}

// stopDefault() 함수를 사용해서 브라우저의 기능을 덮어쓰기
/*
*	이 코드는 페이지 내의 모든 링크에 대해서, 완전히 새로운 페이지를 열지 않고 자체적인 <iframe> 에 로딩되게 한다. 
*	이렇게 하면 사용자가 현재 페이지에 계속 머무르게 하는 효과가 있다.
*/
// 페이지 안에 이미 ID가 'Iframe' 인 IFrame 이 있다고 가정하자.
var iframe = document.getElementById("iframe");

// 페이지 안의 모든 a 엘리먼트를 찾는다.
var a = document.getElementsByTagName("a");
for( var i=0; i < a.length; i++) {
	// a 에 click 처리기를 연결한다.
	a[i].onclick = function(e) {
		// IFrame 의 주소를 설정한다.
		iframe.src = this.href;		// 동일 origin 에 있는 페이지만 가능
		
		console.log(this.href);
		
		// a 가 가리키는 웹사이트를 방문하는, 브라우저의 기본 동작을 막는다.
		return stopDefault(e);
	};
	
}

/*
*	이벤트 리스너 연결하기
*	- 초창기 : HTML 문서 내에 인라인으로 이벤트 처리기 코드를 작성함
*			그러나, 인라인 방식은 무간섭 DOM 스크립팅의 데이터 추상화 원칙에 위배됨
*	- W3C 표준 : 넷스케이프의 변형판
*				IE 모델은 그대로 남음
*	- 이벤트를 안정적으로 등록할 수 있는 3가지 방법
*		(1) 인라인 방식 : 신뢰할만하며, 일관된 형태로 동작함
*		(2) IE 방식 
*		(3) W3C 방식
*	
*/
/*
*	전통적인 연결 방법
*		- 이벤트 처리기를 연결하기 위한 가장 간단한 방법이자 가장 널리 호환되는 방법
*		- DOM 엘리먼트에 프로퍼티의 형태로 함수를 붙임
*		- 장점
*			(1) 간단하고, 일관적임, 어떤 브라우저를 사용하든 관계 없이 동일한 동작을 보장받을 수 있다.
*			(2) 이벤트를 다룰 때, this 키워드가 현재 엘리먼트를 참조한다. 
*		- 단점
*			(1) 캡처 단계와 버블 단계 모두에 대해서가 아니라, 오직 이벤트 버블 단계에서만 작동한다.
*			(2) 어떤 엘리먼트에 대해서 한 번에 단 하나의 이벤트 처리기만 연결할 수 있다.
*				window.onload 프로퍼티와 같이 널리 쓰이는 이벤트를 다룰 때면, 다른 곳에서 동일한 이벤트를 연결해 놓은 경우, 다시 이벤트를 연결하면 기존 이벤트의 연결을 덮어씀
*			(3) 이벤트 객체 전달 인자는 IE 가 아닌 브라우저에서만 사용 가능하다.			
*		
*/

// 전통적인 이벤트 연결 방법으로 이벤트 붙이기

// 첫번째 form 엘리먼트를 찾아서, submit 처리기를 붙인다.
/*
document.getElementsByTagName("form")[0].onsubmit = function(e) {
	// 모든 폼 제출 시도를 중단시킨다.
	return stopDefault(e);
}
*/

// 문서의 body 엘리먼트에 keypress 이벤트 처리기를 붙인다.
//document.body.onkeypress = myKeyPressHandler;

// 페이지에 load 이벤트 처리기를 붙인다.
//window.onload = function(){...}

function myKeyPressHandler() {
	alert("HI!");
}

// 서로를 덮어쓰는 이벤트 처리기

// 최초의 load 처리기를 연결한다.
//window.onload = myFirstHandler;

// 코드의 어딘가, 여러분이 포함시킨 라이브러리에서 여러분이 앞서 연결해놓은 처리기를 덮어 써버린다.
// 이제 페이지 로딩이 완료되면, mySecondHandler 만이 호출된다.
//window.onload = mySecondHandler;

function myFirstHandler() {
	alert("myFirstHandler");	 
}

function mySecondHandler() {
	alert("mySecondeHandler");	 
}
/*
*	DOM 연결 : W3C
*		- DOM 엘리먼트에 이벤트 처리기를 연결하는 방법 중 표준으로 채택된 것은 W3C 의 방법이 유일하다. 
*		- IE 를 제외한 모든 최신 브라우저들은 이벤트를 붙이는 데 이 방법을 지원함
*		- 모든 DOM 엘리먼트마다 addEventListener 라는 함수가 존재하며, 이 함수는 3개의 매개변수를 받는다.
*		- addEventListener 함수 매개변수
*			이벤트 이름(ex. click), 이벤트를 처리할 함수, 이벤트 캡쳐 과정을 활성화할지 여부를 결정하는 boolean 플래그
*		- W3C 연결 방법의 장점
*			(1) 이 메서드는 이벤트를 처리하는 과정에서 캡처와 버블 단계를 모두 지원한다.
*				addEventListener 의 마지막 매개 변수를 설정하여 이벤트 처리 과정을 전환할 수 있다.(false:버블, true:캡쳐)
*			(2) 이벤트 처리기 함수 내부에서 this 키워드는 현재 엘리먼트를 참조한다.
*			(3) 이벤트 객체는 처리 함수의 첫 번째 전달인자로 얻을 수 있다.
*			(4) 대상 엘리먼트에 원하는 만큼 얼마든지 많은 이벤트를 연결할 수 있다.
*				이렇게 해도 기존에 연결된 처리기는 전혀 덮어쓰지 않는다. 
*		- W3C 연결 방법의 단점
*			(1)IE 에서는 작동하지 않는다. IE 에서는 IE의 attachEvent함수를 대신 사용해야 한다.
*/
//	W3C 방법을 사용해서 이벤트 처리기를 연결하는 예
// 첫번째 form 엘리먼트를 찾아서 submit 이벤트 처리기를 붙인다.
/*
document.getElementsByTagName("form")[0].addEventListener("submit", function(e) {
	// 모든 폼 제출 시도를 막는다.
//	alert(1);
	return stopDefault(e);
}, false);
*/

// 문서의 body 엘리먼트에 keypress 이벤트 처리기를 붙인다.
/* document.body.addEventListener("keypress", myKeyPressHandler, false); */

// 페이지에 load 이벤트 처리기를 붙인다.
//window.addEventLisener("load", function(){...}, false);

/*
*	DOM 연결 : IE	
*		- attachEvent 함수 사용함
*		- 매개변수 : 이벤트이름(ex. onclick), 이벤트를 처리할 함수)
*		- 장점
*			(1) 대상 엘리먼트에 원하는 만큼 많은 이벤트를 연결할 수 있고, 기존에 이미 연결된 처리기를 전혀 덮어쓰지 않는다. 
*		- 단점
*			(1) IE 는 이벤트의 버블 단계만 지원한다.
*			(2) 이벤트 리스너 함수 내에서 this 키워드는 현재 엘리먼트가 아니라 window 객체를 가리킨다.
*			(3) 이벤트 객체는 오직 window.event 매개 변수를 통해서만 사용 가능하다. 
*			(4) 이벤트의 이름을 'on-타입' 형식으로 지명해야만 한다. 
*			(5) IE 에서만 동작한다. IE 외의 브라우저에서는 W3C 의 addEventListener 를 사용해야 한다.
*/
// IE 의 이벤트 연결방법을 사용해서 엘리먼트에 처리기를 연결하는 예
// 첫 번째 form 엘리먼트를 찾아서 submit 이벤트 처리기를 붙인다. 
/*
document.getElementsByTagName("form")[0].attachEvent("onclick", function(){
	//모든 폼 제출 시도를 막는다.
	return stopDefault();
});
*/

// 문서의 body 엘리먼트에 keypress 이벤트 처리기를 붙인다.
/* document.body.attachEvent("onkeypress", myKeyPressHandler); */

// 페이지에 load 이벤트 처리기를 붙인다.
//window.attachEvent("onload", function(){...}); 

/*
*	addEvent & removeEvent
*		- 딘 에드워즈 개발
*		- 이벤트 처리기를 붙이는 전통적인 수단 사용함
*		- 브라우저의 디폴트 이벤트 막기, 올바른 이벤트 객체 포함, 올바른 this 키워드 포함 등..
*		- 모든 브라우저에서 동작하며, 메모리 누수도 없음
*		- addEvent 의 장점
*			(1) 모든 브라우저, 최신 방법을 지원하지 않는 오래된 브라우저에서도 동작함
*			(2) 연결된 함수 모두에서 현재 엘리먼트를 가리키는 this 키워드를 쓸 수 있다.
*			(3) 브라우저의 기본 동작을 막는 브라우저 고유의 함수들, 이벤트 버블 과정을 중단시키는 브라우저 고유의 함수들을 하나의 통일된 방법을 대신한다.
*			(4) 브라우저 종류에 관계 없이 이벤트 객체가 항상 첫 번째 전달인자로 전달된다.
*		- addEvent 의 단점
*			(1) 전통적인 방식의 이벤트 연결 기법을 사용하기 때문에 오직 버블 단계 에서만 동작한다.
*/
// addEvent 함수를 사용하는 예
// 페이지 로딩이 완료되기를 기다린다.
addEvent(window, "load", function(){
	// 사용자에게서 keypress 이벤트가 들어오기를 지켜본다.
	addEvent(document.body, "keypress", function(e){
	
	console.log(e.keycode);
	console.log(e.ctrlKey);
		// 만일 사용자가 Ctrl + 스페이스바를 누를 경우
		if (e.keyCode === 32 && e.ctrlKey) {
			// 특별한 폼을 표시한다.
			this.getElementsByTagName("form")[0].style.display = "block";
			
			// 그 외에 다른 이상한 일이 일어나지 않게 한다.
			e.preventDefalt();
		}
	});
});

// 딘 에드워즈가 작성한 addEvent 와 removeEvent 라이브러리
/*
*	addEvent / removeEvent written by Dean Edwards, 2005
*	with input from Tino Zijdel
*	http://dean.edwards.name/weblog/2005/10/add-event
*/
function addEvent(element, type, handler) {
	// 각 이벤트 처리기에 고유의 ID 를 부여한다.
	if(!handler.$$guid) {
		handler.$$guid = addEvent.guid++;
	}
	
	// 대상 엘리먼트의 이벤트 타입들에 대해 해시 테이블을 생성한다.
	if(!element.events) {
		element.events= {};
	}
	
	// 엘리먼트, 이벤트 쌍에 대해 이벤트 처리기들의 해시 테이블을 생성한다.
	var handlers = element.events[type];
	if(!handlers) {
		handlers = element.events[type] = {};
		// 기존의 이벤트 처리기를 저장하낟(만일 존재한다면)
		if(element["on"+type]) {
			handlers[0] = element["on"+type];
		}
	}
	
	// 이벤트 처리기를 해시 테이블에 저장한다.
	handlers[handler.$$guid] = handler;
	// 모든 작업을 담당하는 전역 이벤트의 처리기를 할당한다.
	element["on"+type] = handleEvent;
}

// 고유한 ID 를 부여하기 위한 카운터
addEvent.guid = 1;

function removeEvent(element, type, handler) {
	// 해시 테이블에서 이벤트 처리기를 삭제한다.
	if (element.events && element.events[type]) {
		delete element.events[type][handler.$$guid];
	}
}

function handleEvent(event) {
	var returnValue = true;
	
	// 이벤트 객체를 얻는다(IE 에서는 전역 이벤트 객체를 사용한다.)
	event = event || fixEvent(window.event);
	
	alert(event);
	
	// 이벤트 처리기들을 담고 있는 해시 테이블에 대한 참조를 얻는다.
	var handlers = this.events[event.type];
	
	// 이벤트 처리기를 실행한다.
	for (var i in handlers) {
		this.handleEvent = handlers[i];
		if(this.handleEvent(event) === false) {
			returnValue = false;
		}
	}
	
	return returnValue;
}

// IE 의 이벤트 객체에 빠진 메서드 몇 종루를 추가한다.
function fixEvent(event) {
	// W3C 표준 이벤트 메서드들을 추가한다.
	event.preventDefault = fixEvent.preventDefault;
	event.stopPropagation = fixEvent.stopPropagation;
	
	return event; 
}

fixEvent.preventDefalt = function() {
	this.returnValue = false;
}

fixEvent.stopPropagation = function() {
	this.cancleBubble = true;
}
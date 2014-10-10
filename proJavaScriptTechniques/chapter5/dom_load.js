/*
*	현재 엘리먼트에서 다음의 형제 엘리먼트를 찾는 함수
*/

function next(elem) {
	do {
		elem = elem.nextSibling;
	} while (elem && elem.nodeType !== 1);
	
	return elem;
}

/*
*	특정 ID 의 엘리먼트를 반환하는 wrapper 함수
*/

function id(name) {
	return document.getElementById(name);
}


/*
*	 HTML DOM 문서에서 태그 이름으로 엘리먼트를 찾는 함수
*		- 전달인자가 하나만 제공되고, 그것이 태그 이름이라면, 전체 HTML 문서를 검색한다.
*		- 아니면, 선택적으로 DOM 엘리먼트를 하나 제공하여 검색 시작점을 지정할 수 있다.
*/

function tag(name, elem) {
	return (elem || document).getElementsByTagName(name);
}


/*
*	페이지가 완전히 로딩되기를 기다리기
*		- 가장 일반적인 기법, DOM 연산을 수행하기에 앞서 전체 페이지가 로딩되기를 기다림
*/
// 페이지가 로딩되면 이 함수가 실행되도록 window 객체의 load 이벤트에 이 함수를 추가함
// addEvent 함수는 사용자 정의 함수, 다음 장에서 설명할 예정
/*
	이 기법은 가장 간단할 수는 있겠지만, 언제나 가장 느리게 동작함
	페이지 로딩이 끝나는 단계는 항상 맨 나중에 수행되는 절차이기 때문
*/
addEvent(window, "load", function(){
	next(id("everywhere")).style.background = "blue";
});

/*
*	대부분의 DOM 이 로딩되기를 기다리기
*		- 정석은 아니며, 추천할만한 방법은 아님
*		- 브라우저는 DOM 을 생성해가면서 스크립트를 마주치면 이를 실행시킨다. 그리고 스크립트가 접근할 수 있는 DOM 은 자신이 위치한 곳까지의 DOM뿐이다.
*		- 페이지의 맨 마지막 엘리먼트에 스크립트를 삽입한다면, 그 이전까지 생성한 모든 DOM 엘리먼트들에 접근할 수 있다.
*/
// dom_load.html 인라인스크립트 init();
// DOM 마지막 엘리먼트에 인라인 스크립트를 두어 맨 나중에 스크립트가 파싱되고 실행되게 함
/*
function init() {
	alert("The DOM is loaded!");
	tag("h1")[0].style.border = "4px solid black";
}
*/
/*
*	DOM 이 완전히 불려오는 시점을 알아내기
*		- DOM 이 로딩되는 것을 지켜볼 수 있게 해줌
*		- window 의 load 이벤트에 뭔가를 연결하는 기법의 간단함과 더불어 인라인 스크립트 기법의 빠른 속도도 얻을 수 있음
*		- 브라우저의 연산과정을 가로막지 않으면서 HTML DOM 문서에 원하는 기능이 존재하는지 여부를 가능한 빨리 확인함
*		- HTML 문서가 현재 작업 가능한 상태인지 확인하려면 아래 몇가지를 체크해봐야 함
*			(1) document : 먼저 DOM 문서가 존재하는지 확인해봐야 함. 만일 너무 일찍 확인한 경우라면, document가 undefined 상태일 것임
*			(2) document.getElementsByTagName, document.getElementById
*					현재 문서에(자주 사용되곤 하는) getElementsByTagName과 getElementById 함수가 있는지 확인한다.
*					함수가 사용 가능한 상태라면 존재할 것이다.
*			(3) document.body : 안전을 위하여 <body> 엘리먼트가 완전히 로딩되었는지 확인하면 좋다. 
*/
/*
*	DOM 이 준비될 때까지 기다리는 함수
*		- DOM 이 준비되었을 때 실행될 모든 함수의 참조를 수집한다.
*		- DOM 이 준비되었다고 판단되면 이 참조들을 모두 훑으면서 하나씩 실행한다.
*/
function domReady(f) {
	// 만일 DOM 이 이미 로딩되었다면 즉시 함수를 실행한다.
	if (domReady.done) {
		console.log("1");
		return f();
	}
	
	// 만일 이미 어떤 함수를 추가한 적이 있다면
	if (domReady.timer) {
		console.log("2");

		// 실행될 함수 목록에 그 함수를 추가한다.
		domReady.ready.push(f);
	} else {
		console.log("3");

		// 단지 페이지 로딩이 먼저 끝날 경우를 대비하여
		// 페이지 로딩이 끝나는 시점에 대한 이벤트를 추가한다. addEvent 가 사용된다.
		addEvent(window, "load", isDOMReady);
		
		// 실행될 함수들의 배열을 초기화한다.
		domReady.ready = [f];
		
		// DOM 이 준비되었는지 최대한 빨리 확인한다.
		domReady.timer = setInterval(isDOMReady, 13);
	}
}

/*
*	DOM 이 탐색 가능한 상태인지 확인한다.
*/
function isDOMReady () {
	// 만일 이 페이지가 준비되었다고 이미 파악했다면 무시한다.
	if (domReady.done) {
		console.log("4");
		return false;
	}
	
	// 여러가지 함수와 엘리먼트에 접근할 수 있는지 확인한다.
	if(document && document.getElementsByTagName && document.getElementById && document.body) {
		console.log("5");
		//만일 접근할 수 있다면 확인을 중지해도 좋다.
		clearInterval(domReady.timer);
		domReady.timer = null;
		
		// 대기중인 모든 함수를 실행한다.
		for(var i=0; i<domReady.ready.length; i++) {
			console.log("6");
			domReady.ready[i]();
		}
		
		// 이제 끝났다.
		domReady.ready = null;
		domReady.done = true;
	}
}


// addEvent/removeEvent written by Dean Edwards, 2005
// with input from Tino Zijdel
// http://dean.edwards.name/weblog/2005/10/add-event/

function addEvent(element, type, handler) {
	// assign each event handler a unique ID
	if (!handler.$$guid) handler.$$guid = addEvent.guid++;
	// create a hash table of event types for the element
	if (!element.events) element.events = {};
	// create a hash table of event handlers for each element/event pair
	var handlers = element.events[type];
	if (!handlers) {
		handlers = element.events[type] = {};
		// store the existing event handler (if there is one)
		if (element["on" + type]) {
			handlers[0] = element["on" + type];
		}
	}
	// store the event handler in the hash table
	handlers[handler.$$guid] = handler;
	// assign a global event handler to do all the work
	element["on" + type] = handleEvent;
};
// a counter used to create unique IDs
addEvent.guid = 1;

function removeEvent(element, type, handler) {
	// delete the event handler from the hash table
	if (element.events && element.events[type]) {
		delete element.events[type][handler.$$guid];
	}
};

function handleEvent(event) {
	var returnValue = true;
	// grab the event object (IE uses a global event object)
	event = event || fixEvent(window.event);
	// get a reference to the hash table of event handlers
	var handlers = this.events[event.type];
	// execute each event handler
	for (var i in handlers) {
		this.$$handleEvent = handlers[i];
		if (this.$$handleEvent(event) === false) {
			returnValue = false;
		}
	}
	return returnValue;
};

function fixEvent(event) {
	// add W3C standard event methods
	event.preventDefault = fixEvent.preventDefault;
	event.stopPropagation = fixEvent.stopPropagation;
	return event;
};
fixEvent.preventDefault = function() {
	this.returnValue = false;
};
fixEvent.stopPropagation = function() {
	this.cancelBubble = true;
};

/*
*	HTML 문서에서 엘리먼트 찾기
*		- 자바스크립트 / HTML 개발자들에게 가장 중요한 장점 2 가지는 클래스를 사용할 수 있다는 점과 CSS 선택자를 이해한다는 점
*		- 이를 염두에 두면, DOM 탐색을 보다 간단하고 이해하기 쉽게 해주는 여러 가지 강력한 함수를 만들어 쓸 수 있다. 
*		(1) 클래스 이름으로 엘리먼트 찾기
*			- 모든 엘리먼트(또는 엘리먼트의 부분 집합) 를 검색하면서 특정 클래스를 포함한 엘리먼트를 찾는다.
*/
/*
*	모든 엘리먼트를 검색하여 특정 클래스 이름이 포함된 엘리먼트를 찾는 함수
*		- 이 함수를 사용해서 모든 엘리먼트 또는 특정 타입(li, p 등) 의 모든 엘리먼트 중에서 특정 클래스 이름을 포함한 엘리먼트를 찾음
*		- 검색 범위에 태그 이름을 지정하면 모든 엘리먼트(*) 를 검색할 때보다, 더 빠르게 검색 할 수 있다.
*/
// 아래 함수 동작안함;;;
function hasClass(name, type) {
	var r = [];
	// 클래스 이름을 찾는다(복수 개의 클래스 이름도 허용한다.)
	var re = new RegExp("(^|\\s)"+name+"(\\s|$)");
	
	console.log(re);
	
	// 특정 타입만 검색하도록 범위를 좁히거나, 아니면 전체 엘리먼트를 살펴본다.
	var e = document.getElementsByTagName(type || "*");
	console.log(e);
	console.log(e.length);

	for (var j = 0; j < e.length; j++) {
//		console.log(re.test(e[j]).className);
		// 엘리먼트가 이 클래스를 포함한 경우 반환값에 추가한다.
		if (re.test(e[j].className)) {
			r.push(e[j]);
		}
	}
	//조건에 맞는 엘리먼트들의 목록을 반환한다.
	return r;
}

// test 클래스를 포함한 모든 엘리먼트 찾기
console.log(hasClass("test"));
// test 클래스를 포함한 li 엘리먼트 찾기
console.log(hasClass("test", "li"));
// test 클래스를 포함한 li 엘리먼트 들 중 첫번째 엘리먼트를 찾기
console.log(hasClass("test", "li")[0]);

/*
*	CSS 선택자를 기준으로 엘리먼트 찾기
*		- CSS 선택자는 어떤 엘리먼트들의 집합에 CSS 스타일을 적용하기 위해 쓰이는 표현식이다.
*		(1) #main div p : CSS 1 선택자
*			- 이 표현식은 id 가 main 인 엘리먼트를 찾은 후, 이 엘리먼트의 모든 후손 중에서 div 엘리먼트만을 찾고,
*				div 들의 모든 후손 중에서 p 엘리먼트만들 찾음				
*		(2) div.items > p : CSS 2 선택자
*			- div 엘리먼트 중에서 클래스가 items 인 엘리먼트들을 찾은 후, 이 엘리먼트의 자식 중에서 모든 p 엘리먼트들을 찾는다.
*		(3) div:not(.items) : CSS 3 선택자
*			- 클래스가 items 가 아닌 모든 div 엘리먼트들을 찾는다.
*		- cssQuery : 딘 에드워즈
*		- jQuery : 존 레식
* 		- XPath
*/


















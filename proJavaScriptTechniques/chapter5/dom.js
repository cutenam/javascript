
/*
*  DOM 에서 공백 다루기
*
*	- 장점 : DOM 문서 탐색 시 공백이 제거된 상태에서 엘리먼트를 찾을 수 있으므로 편리함
*	- 단점 : 공백이 있는 텍스트 노드를 찾아내기 위해서 모든 DOM 엘리먼트와 텍스트 노드를 일일이 탐색하므로, 사이트 로딩 속도에 영향을 준다.
* 	- 확인해야할 부분 : nodeType
*				+ 노드 타입을 판별하려면 이 노드의 nodeType 프로퍼티가 특정 값인지 확인하면 된다.
*					(1) Element(nodeType = 1) : XML 파일 엘리먼트 대부분이 이 타입
*												<li>, <a>, <p>, <body> 엘리먼트 등
*					(2) Text(nodeType = 3) : 문서 안에 있는 모든 텍스트가 이 타입에 해당함
*												previousSibling, nextSibling 을 사용하여 DOM 구조를 탐색하다 보면, 많이 만나게 됨
*					(3) Document(nodeType = 9) : 문서의 루트 엘리먼트
*													HTML 문서에서는 <html> 엘리먼트가 이에 해당함
*				+ 또 다른 방법으로 	DOM 노드 타입들을 참조하기 위해 상수를 사용할 수도 있음 (IE 외 브라우저만 가능함)
*					(1) document.ELEMENT_NODE
*					(2) document.TEXT_NODE
*					(3) document.DOCUMENT_NODE
*					
*/

function cleanWhitespace(element) {
	// 엘리먼트가 제공되지 않았으면 HTML 문서 전체에 함수를 적용한다.
	element = element || document;
	// 첫째 자식을 시작점으로 삼는다.
	var cur = element.firstChild;
	
//	console.log(cur);
	
	// 자식 노드가 없을 때까지 계속한다.
	while (cur !== null) {
//	while (cur != null) {
//		console.log(cur);
//		console.log(cur.nodeType);
//		console.log(cur.nodeValue);
		// 이 노드가 텍스트 노드이면서 공백 밖에 없을 경우
		if (cur.nodeType === 3 && ! /\S/.test(cur.nodeValue)) {
//			console.log("remove");
			// 텍스트 노드를 제거한다.
			element.removeChild(cur);
		// 그렇지 않고 엘리먼트인 경우
		} else if (cur.nodeType === 1) {
//			console.log("cleanWS");
			// 하위 단계로 재귀
			cleanWhitespace(cur);
		}
		
//		console.log(cur.nextSibling);
		// 다음 자식 노드로 이동
		cur = cur.nextSibling;
	}
}

//cleanWhitespace();

//console.log(document.documentElement);
//console.log(document.documentElement.firstChild);
//console.log(document.documentElement.firstChild.nextSibling);
//console.log(document.documentElement.firstChild.nextSibling.firstChild);   // text node
//console.log(document.documentElement.firstChild.nextSibling.firstChild.nextSibling);

/*
*	간단한 DOM 탐색
*		- 가장 기본적인 DOM 탐색의 원리(즉, 모든 탐색 가능한 방향으로 포인터가 존재함)
*		- 대부분 DOM 엘리먼트를 탐색하기만 하는 경우가 많으며, 형제 관계의 텍스트 노드들을 탐색하는 경우는 거의 없음
*		- previousSibling, nextSibling, firstChild, lasChild, parentNode 를 편리하게 사용하도록 유틸화함
*/

/*
*	현재 엘리먼트에서 이전 형제 엘리먼트를 찾음
*/

function prev(elem) {
//console.log(elem);
	do {
		elem = elem.previousSibling;
	} while (elem && elem.nodeType !== 1);
	
	return elem;
}

//console.log(prev(document.head));		// null
//console.log(prev(document.body));		// head

/*
*	현재 엘리먼트에서 다음의 형제 엘리먼트를 찾는 함수
*/

function next(elem) {
	do {
		elem = elem.nextSibling;
	} while (elem && elem.nodeType !== 1);
	
	return elem;
}

//console.log(next(document.head));		// body
//console.log(next(document.getElementsByTagName("h1")[0]));		// p

/*
*	현재 엘리먼트의 첫번째 자식 엘리먼트를 찾는 함수
*/

function first(elem) {
	elem = elem.firstChild;
//	console.log(elem.nodeType);
	return elem && elem.nodeType !== 1 ? next(elem) : elem ;
}

//console.log(first(document.head));		// title
//console.log(first(document.getElementsByTagName("p")[0]));		// null
//console.log(first(document.getElementsByTagName("ul")[0]));		// li

/*
*	현재 엘리먼트의 마지막 자식 엘리먼트를 찾는 함수
*/

function last(elem) {
console.log(elem);
	elem = elem.lastChild;
	return elem && elem.nodeType !== 1 ? prev(elem) : elem;
}

//console.log(last(document.head));		// title
//console.log(last(document.getElementsByTagName("p")[0]));		// null
//console.log(last(document.getElementsByTagName("ul")[0]));		// li
//var temp  = document.getElementsByTagName("ul")[0];
//console.log(document.getElementsByTagName("l1"));
//console.log(document.getElementsByTagName("l1")[0]);
//console.log(last(document.getElementsByTagName("l1")));		// undefined

/*
*	 현재 엘리먼트의 부모 엘리먼트를 찾는 함수
*/

function parent(elem, num) {
//console.log(elem);
	num = num || 1;
	for (var i=0; i < num; i++) {
		if(elem !== null) {
//		console.log("1");
			elem = elem.parentNode;
		}
	}
	return elem;
}

//console.log(parent(document.documentElement)); // #document
//console.log(parent(document.body));				// html
//console.log(parent(document.getElementsByTagName("p")[0]));	// body

/*
*	사용예
*/
// h1 다음에 나오는 엘리먼트 탐색
//console.log(next(first(document.body)));		// p

/*
*	모든 HTML 엘리먼트에 직접 연결하기
* 		- HTMLElement 프로토타입에 직접 함수를 추가함
*		- HTMLElement 객체 프로토타입 : FF, Opera, Safari
*		
*		// next 함수를 수정함
*		(1) this 를 현재 엘리먼트를 참조하는 한 줄을 함수 첫머리에 추가함 (현재 엘리먼트를 전달인자 목록에서 가져오는 것이 아님
*		(2) 더 이상 쓰이지 않는 엘리먼트 전달인자를 삭제해야 함
*		(3) 이 함수를 HTMLElement 프로토타입에 연결하여 DOM 상의 모든 HTML 엘리먼트에서 사용할 수 있게 해야 함
*/

HTMLElement.prototype.next = function() {
	var elem = this;
	
	do {
		elem = elem.nextSibling;
	} while ( elem && elem.nodeType !== 1);
	
	return elem;
};

HTMLElement.prototype.first = function() {
	var elem = this;
	elem = elem.firstChild;
//	console.log(elem.nodeType);
	return elem && elem.nodeType !== 1 ? next(elem) : elem ;
};

// console.log(document.body.first().next());		// p

/*
*	표준 DOM 메서드
*		(1)  getElementById("everywhere")
*			- 오직 document 객체에서만 실행될 수 있는 이 메서드는 ID 가 everywhere 인 모든 엘리먼트를 찾아준다.
*			- 어떤 엘리먼트에 즉시 접근할 수 있는 가장 빠른 방법
*		(2) getElementsByTagName("li")
*			-  모든 엘리먼트에서 실행될 수 있는 이 메서드는 태그 이름이 li 인 모든 하위 엘리먼트를 찾아서 NodeList 형태로 반환한다.
			- NodeList 는 배열과 유사하게 동작하지만, push(), pop(), shift() 같은 메서드가 존재하지 않는다.
*/

// 항상 문서에서 처음 등장하는 h1 엘리먼트를 반환함
document.getElementsByTagName("h1")[0]; 

// 모든 li 엘리먼트를 찾은 후 각각 테두리를 추가함
(function(){
	var li = document.getElementsByTagName("li");
	for (var j=0; j<li.length; j++) {
		li[j].style.border = "1px solid #000";
	}
}());

// 첫번째 li 엘리먼트의 텍스트를 굵게 함
//document.getElementById("everywhere").style.fontWeight = "bold";

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

//console.log(next(tag("h1")[0]));		// p


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
//console.log(hasClass("test"));
// test 클래스를 포함한 li 엘리먼트 찾기
//console.log(hasClass("test", "li"));
// test 클래스를 포함한 li 엘리먼트 들 중 첫번째 엘리먼트를 찾기
//console.log(hasClass("test", "li")[0]);

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

/*
*	엘리먼트 내부의 텍스트 얻기
*		- 모든 DOM 엘리먼트에는 텍스트, 다른 엘리먼트 그리고 텍스트와 다른 엘리먼트의 혼합물 중 하나를 담을 수 있다.
*		- 모질라 계열을 제외한 모든 브라우저에는 innerText 라는 프로퍼티가 존재하며 이를 사용하여 엘리먼트 내부의 텍스트를 얻을 수 있음
*		- 엘리먼트 속에 있는 텍스트의 내용을 얻는 비결은 그 텍스트가 엘리먼트에 직접 포함된 것이 아니라는 점에 착안한다.
*			텍스트를 포함하고 있는 주체는 그 엘리먼트 자체가 아니라 그 자식 텍스트 노드이다.
*/
// strong 엘리먼트의 텍스트 내용 얻기
// 모질라 계열이 아닌 브라우저
//strongElem.innerText;
// 모든 플랫폼
//strongElem.firstChild.nodeValue;

/*
	엘리먼트의 텍스트 내용을 얻기 위한 범용 함수
*/
function text(e) {
	var t = "";
	
//	console.log(e.constructor);
	console.log(e);
	console.log(e.childNodes);
	
	// 만일 엘리먼트를 전달받았다면 그 자식들을 얻는다.
	// 그렇지 않은 경우 배열이라고 가정한다.
	e = e.childNodes || e;
	

	console.log(e.length);
	
	// 모든 자식 노드에 대해 반복한다.
	for (var j = 0; j < e.length; j++) {
	
//	console.log(e[j].nodeType);
		// 엘리먼트가 아니라면 이 텍스트 값을 덧붙인다.
		// 엘리먼트라면 다시 그 자식들에 대해 재귀적으로 text() 를 호출한다.
		t += e[j].nodeType !== 1 ?
					e[j].nodeValue : text(e[j].childNodes);
	}
	
	// 찾은 텍스트를 반환한다.
	return t;
}

//console.log(text(document.getElementsByTagName("p")));		// return type : nodelist collection
//console.log(text(document.getElementsByTagName("p")[0]));		// return type : Element

/*
*	엘리먼트 내부의 HTML 얻기
*		- 대부분 브라우저에서 HTML DOM 엘리먼트마다 innerHTML 프로퍼티가 추가되어 있음
*		- 이 프로퍼티를 이용하면 엘리먼트 내부의 모든 HTML과 텍스트를 얻을 수 있음
*		- 만일 대상 엘리먼트에 확실히 텍스트만 존재한다면, innerHTML 프로퍼티를 사용하는 것이 훨씬 간단함
*		- innerHTML 프로퍼티는 빠르다. 엘리먼트의 모든 텍스트 내용을 찾는 재귀 검색보다 몇배는 빠름
*		- 단점은 브라우저마다 구현 방법이 달라서 버그들이 종종 생김
*			(1) 모질라 계열 브라우저에서는 innerHTML 문에서 style 엘리먼트를 반환하지 않는다.
*			(2) IE 에서는 엘리먼트를 모두 대분자로 반환한다.
*			(3) innerHTML 프로퍼티는 오직 HTML DOM 문서의 엘리먼트에서만 지원됨
*									XML DOM 문서에서는 지원하지 않음(null)
*/
// strong 엘리먼트의 innerHTML 얻기
//console.log(document.getElementsByTagName("strong")[0].innerHTML);

// p 엘리먼트의 innerHTML얻기
//console.log(document.getElementsByTagName("p")[0].innerHTML);

/*
*	엘리먼트 어트리뷰트 다루기
*		- 어트리뷰트 목록은 연관 배열의 형태로 저장됨
*		- 브라우저마다 연관 배열에 대한 지원이 다름
*			(1) 사파리 : 지원안함
*			(2) IE : hasAttribute 지원 안함
*		- getAttribute 함수 이용
*/
// DOM 으로 로딩되면, HTML 폼 엘리먼트에 해당하는 변수 formElem 에는 연관배열이 존재하는데,
// 여기에서 어트리뷰트 이름/값 쌍을 수집할 수 있다.
// 연관 배열의 모습은 아래와 같을 것임
/*
document.getElementsByTagName("form")[0].attributes = {
	name: "myForm",
	action: "/test.cgi",
	method: "POST"
}
*/
/*
*	엘리먼트에 특정 어트리뷰트가 존재하는지 판별하기
*/
function hasAttribute(elem, name) {
	return elem.getAttribute(name) !== null;
}

//console.log(hasAttribute(document.getElementsByTagName("form")[0], "action")); // true

/*
*	 어트리뷰트 값을 얻어내거나 설정하기
*		- 엘리먼트에서 어트리뷰트 데이터를 얻는 두 가지 다른 메서드
*		- 아래 메서드는 XML DOM 에도 호환됨
*			(1) getAttribute
*			(2) setAttribute
*		- 표준 getAttribute / setAttribute 외에도 어트리뷰트를 빠르게 추가하거나 설정할 수 있는 프로퍼티 존재함

*/
// 어트리뷰트 얻기
//console.log(id("everywhere").getAttribute("id"));  // everywhere

// 어트리뷰트 값을 설정하기
//tag("input")[0].setAttribute("value", "nameujung");

// 어트리뷰트 빨리 얻기
//console.log(tag("input")[0].value);

// 어트리뷰트 빨리 설정하기
//tag("div")[0].id = "main";

/*
*	클래스에 이름에 대한 어트리뷰트에 접근
*		- 브라우저에서 일관되게 className 이라는 어트리뷰트에 elem.className 과 같이 접근해야한다.
*	for 어트리뷰트에 대한 접근
*		- for 가 아닌 htmlFor 를 사용해야 함
*	CSS 어트리뷰트 대한 접근
*		- cssFloat, cssText 처럼 어트리뷰트 이름이 변경되기도 하는데 이유는 자바스크립트의 예약어이기 때문	
*/
/*
*	엘리먼트 어트리뷰트의 값을 얻거나 설정하기
*		- 모든 예외 경우들을 회피하고, 올바른 어트리뷰트를 얻거나 설정하는데 모든 과정을 간단하게 하려면,
*			모든 예외적이고 특별한 경우를 감안하여 작동하는 함수를 사용해야 한다.
*/
function attr(elem, name, value) {
	// 올바른 name 이 전달되었는지 확인한다.
	if (!name || name.constructor !== String) {
		return "";
	}

	console.log(elem);
	
	// 전달 받은 name 이 예외적인 명명법에 해당하는지 확인한다.
	name = {"for":"htmlFor",
			"class":"className"}[name] || name;
			
	// 만일 값을 설정하려는 경우라면,
	if (value !== null) {
	console.log(elem[name]);
		// 먼저 빠른 방법으로 설정한다.
		elem[name] = value;			// 어트리뷰트 연관 배열

		// 가능하다면, setAttribute 를 사용한다.
		if (elem.setAttribute) {
	console.log(elem.setAttribute);
			elem.setAttribute(name, value);
		}
	}
	console.log(elem[name]);	
	// 어트리뷰트의 값을 반환한다.
	return elem[name] || elem.getAttribute(name) || "";
	
}

//console.log(attr(document.getElementsByTagName("input")[0], "value", "yang"));

// DOM 엘리먼트에서 어트리뷰트 값을 설정하거나 얻는 데 attr 함수를 사용하기
// h1 엘리먼트의 클래스를 설정한다.
//attr(tag("h1")[0], "class", "header");

// 각 input 엘리먼트의 값을 설정한다.
/*
(function(){
	var input = tag("input");
	for(var i=0; i < input.length; i++) {
		attr(input[i], "value", "yang");
	}
}());
*/

// "invalid" 라는 input 엘리먼트 테두리를 추가한다.
// attr(input[i], "name") : undefined
/*
(function() {
	var input = tag("input");
	for(var i=0; i<input.length; i++) {
		if(attr(input[i], "name") === "invalid") {
			input[i].style.border = "2px solid red";
		}
	}
}());
*/

/*
*	 확장 가능한 정의 목록 만들기
*		- 어떤 정의 항목을 클릭하면 그에 대한 정의를 보이거나 숨기는 기능을 제공함
*/
// DOM 이 준비될 때까지 기다린다.
// 동작 안함;;
/*
domReady(function(){
	// 모든 정의 항목을 찾는다.
	var dt = tag("dt");
	for (var i=0; i < dt.length; i++) {
		// 사용자가 어떤 항목을 클릭하는지 살핀다.
		addEvent(dt[i], "click", function(){
			// 해당 정의 항목이 이미 열려 있는지 여부를 확인한다.
			var open = attr(this, "open");
			
			console.log(this);
			console.log(open);		// undefined
			
			console.log(next(this));
			
			// 이 정의 항목의 표시 상태를 전환한다.
			next(this).style.display = open ? "none" : "block";
			
			// 정의가 열려있는 상태라면 기억해둔다.
			attr(this, "open", open ? "" : "yes");
		});
	}
});
*/

/*
*	DOM 변경하기	
*		- 3단계
*			(1) 새로운 엘리먼트 생성
*			(2) 생성한 엘리먼트를 DOM 에 삽입
*			(3) 엘리먼트 제거
*/
/*
*	DOM 을 사용하여 노드를 생성하기
*		- createElement : 엘리먼트를 생성하는 함수
*		- 하지만 바로 생성한 엘리먼트가 DOM 에 삽입되지는 않음
*		- 하나의 매개변수, 즉 엘리먼트 태그 이름을 받은 후 해당 엘리먼트의 가상적인 DOM 표현(어트리뷰트나 스타일이 포함되지 않은 표현) 을 반환한다.
*		- HTML DOM 문서에 네임스페이스를 가진 새로운 엘리먼트를 생성하는 기능(XHTML DOM 문서의 기능) 이 있는지 검사할 수 있음
*		- 네임스페이스를 가진 엘리먼트를 새로 생성할 수 있는 기능이 있다면, 올바른 XHTML 네임스페이스를 사용하여 새로운 DOM 엘리먼트를 생성해야 함
*		- 새로운 텍스트 노드를 생성하는 용도로 createTextNode 라는 DOM 메서드가 있다.
*			노드 안에 담길 텍스트를 전달인자로 받은 후, 생성된 텍스트 노드를 반환한다.
*/
// 새로운 DOM 엘리먼트를 생성하기 위한 일반적인 함수
function create(elem) {
	return document.createElementNS ? 
					document.createElementNS("http://www.w3.org/19999/xhtml", elem) :
					document.createElement(elem);
}

var div = create("div");
div.className = "items";
div.id = "all";

/*
*	DOM 안에 삽입하기
*		(1) insertBefore
*				- 주어진 엘리먼트를 다른 자식 엘리먼트의 앞에 삽입한다.
*				- parentOfBeforeNode.insertBefore(nodeToInsert, beforeNode);
*				- 첫번째 엘리먼트(nodeToInsert) 를 두번째 엘리먼트(beforeNode) 앞에 삽입한다.
*				- 엘리먼트, 텍스트 노드 모두 포함
*		(2) appendChild
*				- 어떤 엘리먼트에 대해서 호출되며, 지정된 노드를 자식 노드 목록의 맨 마지막에 추가한다.
*				- parentElem.appendChild(nodeToInsert);
*/
/*
*	before 와 append() 함수를 위한 헬퍼 함수
*		- 새로운 DOM 엘리먼트를 생성하고 before 와 append 함수를 사용하면 새로운 정보를 DOM 에 추가하여 사용자들에 보여 줄 수 있다.
*/
function checkElem(elem) {
	// 문자열만 제공된 경우 텍스트 노드로 변환한다.
	return elem && elem.constructor === String ?
				document.createTextNode(elem) : elem;
}
/*
	다른 엘리먼트 앞에 엘리먼트를 삽입하는 함수
		- parent : parent
		- before : 첫번째 자식노드
		- elem : 새로 삽입할 엘리먼트
*/
function before(parent, before, elem) {
	// parent 노드가 제공되지 않았는지 확인
//	if(elem === null) {
	if(elem === undefined) {
		elem = before;
		before = parent;
		parent = before.parentNode;
	}
	
	console.log(elem);
	console.log(before);
	console.log(parent);
	
	parent.insertBefore(checkElem(elem), before);
}

/*
*	다른 엘리먼트의 자식으로 엘리먼트를 추가하는 함수
*		- parent : parent
*		- elem : 새로 삽입할 엘리먼트
*/
function append(parent, elem) {
	parent.appendChild(checkElem(elem));
}



// append 와 before 함수 사용하기
// 새로운  li 엘리먼트를 생성한다.
var li = create("li");
attr(li, "class", "new");

// 새로운 텍스트 내용을 생성한 후 이를 li 에 추가한다.
append(li, "Thanks for visiting!");		//  li 는 아직 dom에 삽입되지 않음, text 노드만 생성 후 삽입

// 이 li 를 문서에 처음 등장하는 순서 있는 목록의 맨 앞에 추가한다.
//console.log(first(tag("ol")[0]));	//  null
//before(tag("ol")[0], li);
//before(first(tag("ol")[0]), li);		// 책 소스 잘못됨
append(tag("ol")[0], li);

/*
*	DOM 에 HTML 집어 넣기
*		-  일반적인 DOM 엘리먼트를 생성하여 이를 DOM내부에 삽입하는 방법보다 문서 속에 HTML을 직접 삽입하는 기법이 훨씬 널리 쓰임
*		- innerHTML 사용
*		- 어떤 엘리먼트 내부의 HTML 을 가져오는 방법일 분만 아니라, 엘리먼트 내부에 위치할 HTML 을 설정하기 위한 방법
*		- DOM 엘리먼트 생성 및 텍스트 노드 생성 하는 방법 보다 훨씬 간단
*		- DOM 메서드보다 훨씬 빠름
*		- 문제점
*			(1) XML DOM 문서에는 innerHTML 메서드가 존재하지 않는다. 따라서 통상적인 DOM 생성 메서드를 사용해야함
*			(2) 클라이언트 측 XSLT 를 사용하여 생성된 XHTML 문서에는 innerHTML 메서드가 없다.
*			(3) innerHTML 은 대상 엘리먼트 안에 이미 존재하고 있던 모든 노드들을 완전히 제거한다.
*				따라서, DOM 메서드를 쓸 때와는 달리, 맨 끝에 덧붙이거나 무언가의 앞에 삽입하는 편리한 방법은 없다.
*/
// ol 엘리먼트 안에 몇 개의 li 를 추가하기
tag("ol")[0].innerHTML = "<li>Cats.</li><li>Dogs.</li><li>Mice.</li>";

/*
*	 append, before 메서드를 수정해서, 일반적인 DOM 엘리먼트는 물론, 일반적인 HTML 문자열과 함께 작동하게도 할 수 있다.
*		- 단계
*			(1) 새로운 checkElem 함수를 생성한다.
*			(2) 이 함수는 HTML 문자열, DOM 엘리먼트, DOM 엘리먼트들의 배열을 다룰 수 있다.
*/
//  DOM노드와 HTML 문자열이 혼합된 전달인자를 순수한 DOM 노드로 구성된 배열로 변환하기
function checkElem_n(a) {
	var r = [];
	
	// 전달인자가 배열이 아니면, 강제로 배열 형태로 만든다.
	if (a.constructor !== Array) {
		a = [a];
	}
	
	for(var i=0; i<a.length; i++) {
		// 문자열이 있으면
		if(a[i].constructor === String) {
			// HTML 을 담기 위한 임시 엘리먼트를 생성한다.
			var div = document.createElement("div");
			
			// HTML 을 집어 넣어서 DOM 구조로 변환한다.
			div.innerHTML = a[i];
			
			// 임시로 만든 div 에서 DOM 구조를 다시 꺼낸다.
			for(var j=0; j<div.childNodes.length; j++) {
				r[r.length] = div.childNodes[j];
			}
		} else if (a[i].length) {
			// DOM 노드의 배열이라고 가정한다.
			for(var j=0; j<a[i].length; j++) {
				r[r.length] = a[i][j];
			}
		} else {	// 그렇지 않으면, DOM 노드라고 가정한다.
			r[r.length] = a[i];
		}
	}
	
	return r;
}

// 개선된 DOM 삽입 함수와 추가 함수
function before_n(parent, before, elem) {
	// 부모노드가 제공되지 않았는지 확인한다.
//	if (elem === null) {
	if (elem === undefined) {
		elem = before;
		before = parent;
		parent = before.parentNode;
	}
	
	// 엘리먼트들의 배열을 얻어낸다.
	var elems = checkElem_n(elem);
	
	// 엘리먼트들을 앞에다 붙여야 하므로, 배열을 뒤에서부터 하나씩 훑어간다.
	for(var i=elems.length-1; i>=0; i--) {
		parent.insertBefore(elems[i], before);
	}
}

function append_n(parent, elem) {
	// 엘리먼트 배열을 얻는다.
	var elems = checkElem_n(elem);
	
	console.log(elems);
	
	// 모두 엘리먼트 뒤에 덧붙인다.
	for(var i=0; i< elems.length; i++) {		// 소스 수정
		parent.appendChild(elems[i]);
	}
}

append_n(tag("ol")[0], "<li> Mouse trap.</li>");

before_n(last(tag("ol")[0]), "<li>Zebra</li>");

/*
*	DOM에서 노드 제거하기
*		- DOM 에서 노드를 제거하는 작업은 생성이나 삽입만큼 자주 발생한다.
*		- 노드를 제거하는 기능은 removeChild 라는 하나의 함수로 캡슐화 되어 있다.
*		- appendChild 와 같은 방식으로 사용되지만 그 결과는 정 반대이다.
*		- NodeParent.removeChild(NodeToRemove);
*/
// DOM 에서 노드를 하나 제거하는 함수
function remove(elem) {
	if(elem) {
		elem.parentNode.removeChild(elem);
	}
}

//remove(tag("p")[0]);

// 어떤 엘리먼트에서 모든 자식 노드를 제거하는 함수
function empty(elem) {
	while(elem.firstChild) {
		remove(elem.firstChild);
	}
}
// ol 에서 마지막 li 를 제거하기
//remove(last(tag("ol")[0]));

//empty(last(tag("ol")[0]));  // 소스 수정
empty(tag("ol")[0]);





























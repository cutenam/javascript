
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
document.getElementById("everywhere").style.fontWeight = "bold";

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

console.log(next(tag("h1")[0]));		// p


















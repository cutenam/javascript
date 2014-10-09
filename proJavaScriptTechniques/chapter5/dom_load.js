/*
*	페이지가 완전히 로딩되기를 기다리기
*		- 가장 일반적인 기법, DOM 연산을 수행하기에 앞서 전체 페이지가 로딩되기를 기다림
*/
// 페이지가 로딩되면 이 함수가 실행되도록 window 객체의 load 이벤트에 이 함수를 추가함
// 
addEvent(window, "load", function(){
	next(id("everywhere")).style.background = "blue";
});
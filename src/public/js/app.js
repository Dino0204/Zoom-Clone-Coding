// ws 연결 시 http로도 연결 가능한 경우가 있음
// -> 브라우저가 자동적으로 프로토콜을 변경하거나 서버 설정에 따라 다르게 처리되기 때문
// -> 따라서 프로토콜을 명시적으로 지정하는 것이 좋음
const socket = new WebSocket(`ws://${window.location.host}`);

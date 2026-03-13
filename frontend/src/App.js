import React, { useState, useEffect } from 'react';

function App() {
  const [serverMessage, setServerMessage] = useState('서버와 연결 중...'); //useState: 화면에 보여줄 글자나 데이터를 담아두는 바구니


  useEffect(() => { //useEffect: 화면이 처음 딱 나타날 때, 자동으로 실행할 동작(데이터 가져오기 등)을 적어두는 곳.
    // 백엔드 주소로 데이터를 요청
    fetch('http://localhost:5000/api/hello') //브라우저가 백엔드 API 주소에 데이터를 달라서 요청하는 함수
      .then((response) => response.json())
      .then((data) => {
        setServerMessage(data.message); // 받은 메시지로 글자를 바꿈
      })
      .catch((error) => {
        console.error('에러 발생:', error);
        setServerMessage('ㅅㅂ 서버 연결 실패');
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>OneResume 프로젝트</h1>
      <p>백엔드에서 온 메시지: <strong>{serverMessage}</strong></p>
    </div>
  );
}

export default App;
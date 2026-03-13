const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors()); //모든 도메인에서의 접속 허용

app.get('/api/hello', (req, res) => {
	res.json({ message: '안녕! 나는 백엔드 서버야.' });
});

app.listen(port, () => {
	console.log('서버가 http://localhost:${port}');
});
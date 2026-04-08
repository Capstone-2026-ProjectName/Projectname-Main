// 로컬 환경인지 배포 환경인지에 따라 API 주소를 자동으로 결정합니다.
const isProduction = window.location.hostname !== "localhost";

export const API_BASE_URL = isProduction 
  ? "http://3.38.246.44:5000" 
  : "http://localhost:5000";

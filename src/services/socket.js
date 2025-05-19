// import { io } from 'socket.io-client';

// const SOCKET_URL = `${import.meta.env.VITE_APP_SOCKET_UR}` || 'http://localhost:3000';

// // สร้าง singleton instance ของ socket
// let socket;

// export const initSocket = () => {
//   if (!socket) {
//     socket = io(SOCKET_URL);

//     socket.on('connect', () => {
//       console.log('Connected to socket server');

//       // ลงทะเบียน user ID กับ socket server
//       const token = localStorage.getItem('token');
//       if (token) {
//         const base64Url = token.split('.')[1];
//         const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//         const jsonPayload = decodeURIComponent(
//           atob(base64)
//             .split('')
//             .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
//             .join('')
//         );

//         const tokenPayload = JSON.parse(jsonPayload);
//         const userId = tokenPayload.user.type_id;

//         if (userId) {
//           socket.emit('register', userId);
//         }
//       }
//     });

//     socket.on('disconnect', () => {
//       console.log('Disconnected from socket server');
//     });

//     socket.on('connect_error', (error) => {
//       console.error('Socket connection error:', error);
//     });
//   }

//   return socket;
// };

// export const getSocket = () => {
//   if (!socket) {
//     return initSocket();
//   }
//   return socket;
// };

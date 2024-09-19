const app = require("./src/app");

const PORT = process.env.PORT || 3055;

const server = app.listen(PORT, () => console.log(`starting at port ${PORT}`));

// process.on('SIGINT', () => {
//   server.close(() => console.log('Exit server'));
//   // notify server crash...
// });

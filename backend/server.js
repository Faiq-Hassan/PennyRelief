const http = require('http');

const app = require('./app')
const PORT = process.env.PORT || 5000;


const Server = http.createServer(app)


Server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT} with MongoDB Atlas`);
})
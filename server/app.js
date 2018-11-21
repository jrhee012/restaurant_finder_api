const server = require('./server');

const port = process.env.PORT || 8080;

server.listen(port, err => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`${server.name} started listening on ${port}`);
})

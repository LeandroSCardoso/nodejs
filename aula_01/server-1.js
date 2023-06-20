
import http from 'http'

http.createServer((req, res) => {

    res.end('Ola mundo!')

}).listen(3033)//porta 3033
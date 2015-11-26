console.log('Initialising Http Request Logger');

var http = require('http');

var winston = require('winston');
winston.remove(winston.transports.Console);
winston.add(winston.transports.File, { filename: 'requests.log' });


var server = http.createServer(function (request, response) {
    var headers = request.headers;
    var method = request.method;
	var payload = [];
	
	request.on('data', function (chunk) {
        payload.push(chunk);
    }).on('end', function () {
        var request = method + ' / HTTP/1.1 ';

        payload = Buffer.concat(payload).toString();

		response.on('error', function (err) {
			console.error(err);
		});
		
		response.statusCode = 200;
		
		for (var header in headers) {
			if (headers.hasOwnProperty(header)) {
                request = request + header + ': ' + headers[header] + ' ';
			}
		}
		
		request = request + 'Payload: ' + payload;
		winston.info(request);
		response.end();
	});
}).listen(55555);

console.log('Http Request Logger is running.');
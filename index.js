const { spawn } = require('child_process'),
    http = require('http'),
    fs = require('fs');

let savedLink = '',
    processedLink = '';


const server = http.createServer((req, res) => {

    if (req.method === 'POST') {

        let reqBody = '',
            action = '',
            link = '';

        req.on('data', chunk => {
            reqBody += chunk.toString();
        });

        req.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });

            let q = JSON.parse(reqBody);
            action = q.action, link = q.link;

            if (action === 'get') {
                res.end(
                    JSON.stringify({
                        status: true,
                        link: savedLink,
                        plink: processedLink
                    })
                );
            } else if (action === 'new' && link && /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig.test(link)) {


                let response = {
                    status: true,
                    link: link,
                    links: []
                }

                const getLink = spawn('youtube-dl', [
                    '-g',
                    link
                ]);

                getLink.stdout.on('data', data => {
                    processedLink = data.toString();
                    savedLink = processedLink ? link : savedLink;
                    response.plink = processedLink.trim();
                });

                getLink.on('close', (e) => {
                    response = JSON.stringify(response);
                    res.end(response);
                });

                getLink.on('error', function(e) {
                    res.end({ status: false, error: e });
                });

            } else {
                res.end();
            }
        });

    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('index.html'));
    }

});

server.listen(3000, err => {
    if (err)
        console.log(err);
    else
        console.log('LISTENING ON PORT 3000');
});

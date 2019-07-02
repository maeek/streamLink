# Stream link

Get stream link for videos. Wrapper for: ```youtube-dl -g```

## Running

```
node index.js
```
## Run in docker
```
docker run -d -v /path/to/streamLink/files:/srv --name streamLink -p 80:3000 -w /srv node:10.16.0 node index.js
```

## Preview

![Stream Link](https://raw.githubusercontent.com/maeek/streamLink/master/preview.png)

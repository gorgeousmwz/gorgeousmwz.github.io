const https = require('https');
const fs = require('fs');
const path = require('path');

// 确保images目录存在
const imagesDir = 'assets/img/backimages';
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
}

var idx = Math.floor(Math.random() * 7);
const options = {
    hostname: 'www.bing.com',
    port: 443,
    path: '/HPImageArchive.aspx?format=js&idx='+String(idx)+'&n=8',
    method: 'GET'
};

const req = https.request(options, bing_res => {
    let bing_body = [];
    bing_res.on('data', (chunk) => {
        bing_body.push(chunk);
    });
    bing_res.on('end', () => {
        bing_body = Buffer.concat(bing_body);
        const bing_data = JSON.parse(bing_body.toString());
        const img_array = bing_data.images;

        img_array.forEach((img, index) => {
            const imgUrl = `https://www.bing.com${img.url}`;
            const imgPath = path.join(imagesDir, `bing_${index}.jpg`);

            const imgReq = https.get(imgUrl, imgRes => {
                const imgData = [];
                imgRes.on('data', (chunk) => {
                    imgData.push(chunk);
                });
                imgRes.on('end', () => {
                    const imgBuffer = Buffer.concat(imgData);
                    fs.writeFile(imgPath, imgBuffer, (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log(`Image saved: ${imgPath}`);
                    });
                });
            });

            imgReq.on('error', error => {
                console.error(`Error downloading image ${imgUrl}: `, error);
            });
        });
    });
});

req.on('error', error => {
    console.error(error);
});

req.end();
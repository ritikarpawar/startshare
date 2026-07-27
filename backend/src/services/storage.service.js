const ImageKit = require('@imagekit/nodejs').default || require('@imagekit/nodejs')

const imagekit = new ImageKit({
    publicKey: process.env.IMAGE_PUBLIC_KEY,
    privateKey: process.env.IMAGE_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGE_URL_ENDPOINT
})

async function uploadFile(buffer){
    const result = await imagekit.files.upload({
        file: buffer.toString('base64'),
        fileName: "Image.jpg"
    })
    return result;
}

module.exports = uploadFile
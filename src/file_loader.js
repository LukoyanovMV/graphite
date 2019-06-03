class FileLoader {
    static load(url) {
        return new Promise((resolve, reject) => {
            if (!url || typeof url !== 'string') {
                reject('FileLoader Error: url is not defined');
            }

            fetch(url)
                .then(response => {
                    return response.arrayBuffer();
                })
                .then(buffer => {
                    const fileBuff = new Uint8Array(buffer);
                    resolve(fileBuff);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}

export default FileLoader;

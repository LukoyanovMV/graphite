if ('default' in G) {
    G = G.default;
}

const psd = new G.Psd();

psd.load('black-ui.psd')
    .then(() => {
        console.time('renderLayers');
        var canvas = psd.layersToCanvas();
        document.body.appendChild(canvas);
        console.timeEnd('renderLayers');

        // console.time('render');
        var canvas = psd.toCanvas();
        document.body.appendChild(canvas);
        // console.timeEnd('render');
    });

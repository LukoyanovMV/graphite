import Layer from './layer';

class LayersCollection {
    constructor(rawLayers) {
        this.layers = [];
        this.isRoot = true;

        if (rawLayers) {
            this.prepareLayers(rawLayers);
        }
    }

    isFolder() {
        return true;
    }

    apply(rawLayers) {
        this.layers = [];
        if (rawLayers) {
            this.prepareLayers(rawLayers);
        }
    }

    prepareLayers(rawLayers) {
        const len = rawLayers.length - 1;

        this.layers = [];

        let layer;
        let parent = [-1];

        for (let i = len; i >= 0; i--) {
            layer = rawLayers[i];

            if (layer.lsct) {
                if (layer.lsct.type === 1 || layer.lsct.type === 2) {
                    this.layers.unshift(new Layer(layer, parent[parent.length - 1], this));
                    parent.push(layer.id);
                } else if (layer.lsct.type === 3) {
                    parent.pop();
                } else {
                    this.layers.unshift(new Layer(layer, parent[parent.length - 1], this));
                }
            } else {
                this.layers.unshift(new Layer(layer, parent[parent.length - 1], this));
            }
        }
    }

    getLayer(id) {
        const res = this.layers.filter((l) => {
            return l.id === id;
        });

        return res[0];
    }

    getParentsFor(id) {
        const parents = [];
        let target = this.getLayer(id);
        while (target.parent !== -1) {
            target = this.getLayer(target.parent);
            parents.push(target);
        }
        return parents;
    }

    getChilds(id) {
        if (id === undefined) {
            id = -1;
        }

        return this.layers.filter((l) => {
            return l.parent === id;
        });
    }
};

export default LayersCollection;

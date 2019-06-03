import {toBits} from '../utils/bytes_lib';
import KEY from '../decoder/key-map';
import decode from '../decoder';
import {Rect} from '../utils';


class Layer {
    constructor(props, parent, collection) {
        this.props = props;
        this.parent = parent;
        this.collection = collection;
        this.flags = toBits(this.props.flags);
        this.id = this.props.id;
        this.styles = {};
        this.makeDecoding();
    }

    makeDecoding() {
        if (this.props[KEY.STYLES]) {
            this.styles = decode(KEY.STYLES, this.props[KEY.STYLES]);
        }
    }

    get isVisible() {
        return !!this.flags[1];
    }

    isFolder() {
        return this.props.lsct && (this.props.lsct.type === 1 || this.props.lsct.type === 2);
    }

    getChannel(num) {
        return this.props.channelsInfo[num];
    }

    get name() {
        return this.props.name;
    }

    get width() {
        return this.props.right - this.props.left;
    }

    get height() {
        return this.props.bottom - this.props.top;
    }

    get left() {
        return this.props.left;
    }

    get top() {
        return this.props.top;
    }

    get chNumber() {
        return this.props.channelsNumber;
    }

    get opacity() {
        return this.props.opacity / 255;
    }

    getRealOpacity() {
        const parents = this.collection.getParentsFor(this.id);
        let opacity = this.opacity;
        for (let i = 0; i < parents.length; i++) {
            opacity *= parents[i].opacity;
        }
        return opacity;
    }

    getChannelById(id) {
        let res;
        res = this.props.channelsInfo.filter((chInfo) => {
            return chInfo.channelId === id;
        });
        return res[0];
    }

    getChilds() {
        return this.isFolder() ? this.collection.getChilds(this.id) : [];
    }

    getStyles() {
        return this.get('')
    }

    getRect() {
        return Rect(this.left, this.top, this.width, this.height);
    }

    get(prop) {
        if (prop) {
            return this.props[prop];
        }
    }
};

export default Layer;

import strokeEffect from './stroke';
import colorEffect from './color';
import innerShadowEffect from './in_shadow';
import shadowEffect from './shadow';


export default (ctx, layer) => {
    if (!layer || !ctx) {
        return;
    }

    if (layer.styles !== undefined /*&& layer.props.lrFX !== undefined*/) {
        if (layer.name === 'Layer 3') {
            // return;
        }
        if (layer.styles.COLOR_OVER) {
            colorEffect(ctx, layer, layer.styles.COLOR_OVER);        
        }

        if (layer.styles.STROKE) {
            strokeEffect(ctx, layer, layer.styles.STROKE);        
        }

        if (layer.styles.INNER_SHADOW) {
            innerShadowEffect(ctx, layer, layer.styles.INNER_SHADOW);        
        }

        if (layer.styles.DROP_SHADOW) {
            shadowEffect(ctx, layer, layer.styles.DROP_SHADOW);        
        }
    }

};
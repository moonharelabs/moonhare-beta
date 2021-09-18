import { PluginUtils } from '../interfaces';
import preflight from './preflight';

import utilities from './utilities';
import variants from './variants';

export default function defaultPlugin(utils: PluginUtils) {
    utilities(utils);
    variants(utils);
    preflight(utils);
}

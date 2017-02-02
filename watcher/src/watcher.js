/* @flow */

import R from 'ramda';
import path from 'path';
import chokidar from 'chokidar';

const filenameFromPath = R.curry((location) => path.basename(location));

const parseXml = (path: string, evt) : void => {
    console.log(`path - ${path}`);
    console.log(evt);
};

const pathToGlob = (location: string) : string => R.converge(path.join, [
    path.dirname,
    /* $FlowIgnore: 'over' and 'lensIndex' not included in declaration */
    R.compose(R.join(''), R.over(R.lensIndex(0), e => `[${e}]`), filenameFromPath)
])(location);

const startMonitor = (file: string) : void => chokidar.watch(file, { ignored: /(^|[\/\\])\../, persistent: true, cwd: '.' }).on('change', parseXml);

export default R.compose(startMonitor, pathToGlob);

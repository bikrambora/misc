const fs = require('fs');
const R = require('ramda');
const { fromNullable: maybe } = require('data.maybe');
const Future = require('fluture');
const request = require('request');
const semver = require('semver-utils');

const header = 'name,version,type,dependency, depversion, depversionclean, depversionoperator';

const fetch = (opts) => Future((rej, res) => void request(opts, (err, response, body) => {
    if(err) return rej(err);
    return res(body);
}));

const writeFile = R.curry((file, contents) => fs.writeFileSync(file, contents));

const pkg = {
  "name": "ohw-svg",
  "version": "1.1.0",
  "dependencies": {
    "gsap": "^1.19.0",
    "lodash": "^3.10.1",
    "react": "^15.0.1",
    "react-dom": "^15.0.1"
  },
  "devDependencies": {
    "babel-plugin-transform-class-properties": "^6.4.0",
    "babel-plugin-transform-es2015-classes": "^6.4.0",
    "babel-preset-es2015": "^6.6.0",
    "babel-preset-react": "^6.3.13",
    "chai": "^3.4.1",
    "eslint": "2.5.3",
    "eslint-config-orionhealth": "~2.0.1",
    "javascript-workflow-orionhealth": "^0.6.1",
    "karma-junit-reporter": "^0.4.1",
    "oh-roost-plugin-hive": "*",
    "react-addons-test-utils": "^15.0.1",
    "skin-deep": "^0.16.0"
  }
};

const packages = [
    'ohw-svg',
    'ohw-svg'
];

const peek = R.tap(console.log);
const propToPairs   = R.curry((name, obj) => R.compose(R.toPairs, R.prop(name))(obj));
const pairsToRows   = R.curry((row, pairs) => R.map(arr => row(arr[0], arr[1]))(pairs));
const objToRows     = R.curry((prop, row, obj) => R.compose(pairsToRows(row), propToPairs(prop))(obj));
const pkgUrl        = R.curry((repo) => ({ uri:`https://stash/projects/OHW/repos/${repo}/browse/package.json?raw`, rejectUnauthorized: false }));
const createRow     = R.curry((name, version, type, dep, depVersion) => `${name},${version},${type},${dep},${depVersion},${versionToRange(depVersion)}`);
const fetchPackages = R.compose(R.map(fetch), R.map(pkgUrl))(packages);

const versionToRange = (version) => {
    const range = maybe(semver.parseRange(version)[0]);
    const clean = range.map(R.compose(R.join('.'), R.props(['major', 'minor', 'patch']))).getOrElse('any');
    const operator = range.chain(R.compose(maybe, R.prop('operator'))).getOrElse('fixed');
    return R.join(',', [clean, operator]);
};

const createAppCsv = (pJson) => {
    const nameAndVersionRow = createRow(pJson.name, pJson.version);
    const dependenciesRows = objToRows('dependencies', nameAndVersionRow('runtime'));
    const devDependenciesRows = objToRows('devDependencies', nameAndVersionRow('development'));
    return R.converge(R.concat, [dependenciesRows, devDependenciesRows])(pJson);
};

Future.parallel(Infinity, fetchPackages)
    .chain(Future.encase(R.map(JSON.parse)))
    .fork(console.log, R.compose(writeFile('./alldeps.csv'), R.join('\n'), R.prepend(header), R.flatten, R.map(createAppCsv)));

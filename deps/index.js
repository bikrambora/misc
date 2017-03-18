const fs = require('fs');
const R = require('ramda');
const { fromNullable: maybe } = require('data.maybe');
const Future = require('fluture');
const request = require('request');
const semver = require('semver-utils');

const header = 'name,version,type,dependency,depversion,depversionclean,depversionoperator';
const packages = [
    'array of packages'
];

const fetch = (opts) => Future((rej, res) => void request(opts, (err, response, body) => {
    if(err) return rej(err);
    return res(body);
}));

const logError      = console.error;
const writeFile     = R.curry((file, contents) => fs.writeFileSync(file, contents));
const propToPairs   = R.curry((name, obj) => R.compose(R.toPairs, R.prop(name))(obj));
const pairsToRows   = R.curry((row, pairs) => R.map(arr => row(arr[0], arr[1]))(pairs));
const objToRows     = R.curry((prop, row, obj) => R.compose(pairsToRows(row), propToPairs(prop))(obj));
const pkgUrl        = R.curry((repo) => ({ uri:`repository url`, rejectUnauthorized: false }));
const createRow     = R.curry((name, version, type, dep, depVersion) => `${name},${version},${type},${dep},${depVersion},${versionToRange(depVersion)}`);
const fetchPackages = R.compose(R.map(fetch), R.map(pkgUrl));

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

const fetchSuccess = R.compose(
  writeFile('./csv/alldeps.csv'),
  R.join('\n'),
  R.prepend(header),
  R.flatten,
  R.map(createAppCsv)
);

Future.parallel(5, fetchPackages(packages)).chain(Future.encase(R.map(JSON.parse))).fork(logError, fetchSuccess);

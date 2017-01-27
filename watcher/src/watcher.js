/* @flow */

import fs from 'fs';
import R from 'ramda';
import path from 'path';
import chokidar from 'chokidar';
import rp from 'request-promise';
import { emrcUrl } from '../config';
import { Builder, Parser } from 'xml2js';

const parser = new Parser();
const builder = new Builder();
const filenameFromPath = R.curry((location) => path.basename(location));

const sendFhirPatient = (patient: { [key:string] : any }) => {
  rp(emrcUrl).then(_ => true).catch(e => {
    console.log(e);
    return false;
  });
};

const createFhirPatient = (id: number) : { [key:string] : any } => {
  const obj = { id: id };
  const xml = builder.buildObject(obj);
  return xml;
};

const xml2jsP = (str: string) : Promise<{ [key:string] : any }> => {
    return new Promise((resolve, reject) => {
        parser.parseString(str, (err, res) => {
            if (err) return reject(err);
            return resolve(res);
        });
    });
};

const readFileP = (path: string) : Promise<Buffer> => {
  return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) return reject(err);
        return resolve(data);
      });
  });
};

const peek = R.tap(console.log);

/* $FlowIgnore: 'composeP' not included in declaration */
const pushPatientInContext = R.composeP(sendFhirPatient, createFhirPatient, R.path(['root', 'patient']), xml2jsP, readFileP);

const pathToGlob = (location: string) : string => R.converge(path.join,
    /* $FlowIgnore: 'over' and 'lensIndex' not included in declaration */
    [path.dirname, R.compose(R.join(''), R.over(R.lensIndex(0), e => `[${e}]`), filenameFromPath)]
)(location);

const startMonitor = (file: string) : void => chokidar.watch(file, { ignored: /(^|[\/\\])\../, persistent: true, cwd: '.' }).on('change', pushPatientInContext);

export default R.compose(startMonitor, pathToGlob);

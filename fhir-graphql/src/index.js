import profileTypes from '../schemas/profiles-types.json';
import searchParameters from '../schemas/search-parameters.json';
import profileResources from '../schemas/profiles-resources.json';

import R from 'ramda';
import {
  GraphQLInt,
  GraphQLList,
  GraphQLFloat,
  GraphQLSchema,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLUnionType,
  GraphQLObjectType,
  GraphQLInterfaceType
} from 'graphql';

// Generic
const trace = (msg) => R.tap(x => console.log(msg, x));
const notNil = R.compose(R.not, R.isNil);
const greaterThan = R.flip(R.gt);
const lengthGreaterThan = x => R.compose(greaterThan(x), R.length);
const capitalize = str => R.compose(
  R.join(''),
  R.remove(1, 1),
  R.concat(R.__, str),
  R.compose(R.toUpper, R.head)
)(str);

// FHIR
const toFieldName = R.compose(R.replace(/-/g, "_"), R.path(['resource', 'name']));
const whenUnderscore = R.when(R.compose(R.equals('_'), R.head), R.slice(1, R.Infinity));
const zipWithfieldName = R.curry( (x, y) => ({ resource: { ...x.resource, fieldName: y } }) );
const asFieldArgName = R.compose(whenUnderscore, toFieldName);

const makeSearchParams = (searchParams) => R.zipWith(zipWithfieldName, searchParams.entry, R.map(asFieldArgName)(searchParams.entry));
// LS: Assuming all base types are capitalized
const makeSearchParamsByType = R.compose(R.map(R.concat([{name: "_id", fieldArgName: "id"}])), R.groupBy(R.path(['resource', 'base'])));
const searchParamsByType = R.compose(makeSearchParamsByType, makeSearchParams)(searchParameters);
const schemaItemHasElement = R.compose(
  R.both(notNil, lengthGreaterThan(1)),
  R.path(['resource', 'snapshot', 'element'])
);
const whenPathHasX = R.when(
  R.compose(R.test(/\[x\]/), R.prop('path')),
  R.compose((x) => x[1], (e) => R.mapAccum((a, b) => {
    const transformations = {
      path: R.replace("[x]", capitalize(b.code)),
      type: [b]
    };
    return [a, R.evolve(transformations, a)];
  }, e, e.type))
);

const importStructure = R.compose(
  R.reduce((a, b) => R.assoc(b.path, b)(a), {}),
  R.chain(whenPathHasX),
  R.chain(R.path(['resource', 'snapshot', 'element'])),
  R.filter(schemaItemHasElement),
  R.prop('entry')
);

//console.log(searchParameters.entry[0]);
console.log(R.mergeAll([importStructure(profileTypes), importStructure(profileResources)]));

// import express from 'express';
// import graphqlHTTP from 'express-graphql';
//
// const app = express();
// app.use('/graphql', graphqlHTTP({
//   schema: schema,
//   graphiql: true
// }));
//
// app.listen(process.env.PORT || 3000);

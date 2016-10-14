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

const trace = (msg: string): * => R.tap(x => console.log(msg, x));

const toFieldName = R.compose(R.replace(/-/g, "_"), R.path(['resource', 'name']));
const whenUnderscore = R.when(R.compose(R.equals('_'), R.head), R.slice(1, R.Infinity));
const zipWithfieldName = R.curry( (x, y) => ({ resource: { ...x.resource, fieldName: y } }) );
const asFieldArgName = R.compose(whenUnderscore, toFieldName);

const makeSearchParams = (searchParams) => R.zipWith(zipWithfieldName, searchParams.entry, R.map(asFieldArgName))(searchParams.entry));
// LS: Assuming all base types are capitalized
const makeSearchParamsByType = R.compose(R.map(R.concat([{name: "_id", fieldArgName: "id"}])), R.groupBy(R.path(['resource', 'base'])));
const searchParamsByType = R.compose(makeSearchParamsByType, makeSearchParams)(searchParameters);

//console.log(searchParameters.entry[0]);
console.log(searchParamsByType);

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

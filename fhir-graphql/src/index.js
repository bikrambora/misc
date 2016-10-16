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

// Generic section
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

// FHIR section
const structureCode = {
  "path":"code",
  "short":"Primitive Type id",
  "definition":"Short code (no def)",
  "comments":"RFC 4122",
  "min":0,
  "max":"*",
  "base":{"path":"string","min":0,"max":"*"},
  "type":[{"code":"Element"}],
  "children":["code.extension","code.value","code.id"]
};
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
const pathPrefix = R.compose(R.join("."), R.slice(0, -1), R.split("."));
const whenPathHasX = R.when(
  R.compose(R.test(/\[x\]/), R.prop('path')),
  R.compose(R.indexOf(1), (e) => R.mapAccum((a, b) => {
    const transformations = {
      path: R.replace("[x]", capitalize(b.code)),
      type: [b]
    };
    return [a, R.evolve(transformations, a)];
  }, e, e.type))
);

const importStructure = R.compose(
  R.assoc('code', structureCode),
  R.reduce((a, b) => R.assoc(b.path, b)(a), {}),
  R.chain(whenPathHasX),
  R.chain(R.path(['resource', 'snapshot', 'element'])),
  R.filter(schemaItemHasElement),
  R.prop('entry')
);

const addChildren = structure => {
  const cloned = R.clone(structure);
  return R.compose(
    R.always(cloned),
    R.map(k => {
      const path = k.path;
      const prefix = pathPrefix(path);
      if(!cloned[prefix]) return k;
      cloned[prefix].children = cloned[prefix].children || [];
      cloned[prefix].children.push(path);
      return k;
    }),
    R.filter(
      R.compose(
        R.either(
          R.compose(R.not, R.test(/\.contained$/)),
          R.compose(R.not, R.equals(0), R.length, pathPrefix)
        ),
        R.prop('path')
      )
    )
  )(cloned);
};

const allResourcesNames = structure => R.compose(R.filter(k => structure[k].type && structure[k].type[0].code === "DomainResource"), R.keys)(structure);
const resourceFromUri = R.compose(R.last, R.split('/'));
const namesToPaths = structure => R.compose(
  R.reduce((acc, item) => R.assoc(item[0], item[1], acc), {}),
  R.map(k => [structure[k].path.split(".")[0] + " " + structure[k].name, structure[k].path]),
  R.filter(k => R.path([k, 'name'], structure)),
  R.keys
)(structure);

// Next makeSchema
// GraphQl section

console.log(
  R.compose(
    addChildren,
    R.mergeAll
  )([importStructure(profileTypes), importStructure(profileResources)])
);

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

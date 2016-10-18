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
const listContains = R.flip(R.contains);
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
const fhirTypes = ['time', 'base64Binary',  'instant', 'uri', 'string', 'dateTime', 'date', 'xhtml', 'decimal', 'boolean', 'integer'];
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
const fhirToGraphQL = R.cond([
  [listContains(['time', 'base64Binary',  'instant', 'uri', 'string', 'dateTime', 'date', 'xhtml']), R.always(GraphQLString)],
  [R.equals('decimal'), R.always(GraphQLFloat)],
  [R.equals('boolean'), R.always(GraphQLBoolean)],
  [R.equals('integer'), R.always(GraphQLInt)]
]);
const toFieldName = R.compose(R.replace(/-/g, "_"), R.path(['resource', 'name']));
const whenUnderscore = R.when(R.compose(R.equals('_'), R.head), R.slice(1, R.Infinity));
const zipWithfieldName = R.curry( (x, y) => ({ resource: { ...x.resource, fieldName: y } }) );
const asFieldArgName = R.compose(whenUnderscore, toFieldName);

const makeSearchParams = (searchParams) => R.zipWith(zipWithfieldName, searchParams.entry, R.map(asFieldArgName)(searchParams.entry));
// LS: Assuming all base types are capitalized
const makeSearchParamsByType = R.compose(R.map(R.concat([{name: "_id", fieldArgName: "id"}])), R.groupBy(R.path(['resource', 'base'])));
const searchParamsByType = R.compose(makeSearchParamsByType, makeSearchParams)(searchParameters);
const schemaItemHasElement = R.compose(
  R.both(notNil, lengthGreaterThan(0)),
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
  R.reduce((acc, item) => R.assoc(item.path, item, acc), {}),
  R.chain(whenPathHasX),
  R.chain(R.path(['resource', 'snapshot', 'element'])),
  R.filter(schemaItemHasElement),
  R.map(R.dissocPath(['resource', 'text'])),
  R.prop('entry')
);

const addChildren = structure => {
  const cloned = R.clone(structure);
  return R.compose(
    R.always(cloned),
    R.map(k => {
      const path = R.propOr('', 'path', k);
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
  R.map(k => [`${structure[k].path.split(".")[0]} ${structure[k].name}`, structure[k].path]),
  R.filter(k => R.path([k, 'name'], structure)),
  R.keys
)(structure);

// Next makeSchema
// GraphQl section

const extraFieldsFor = (gTypes, item) => R.cond([
  [
    R.equals('Patient'),
    R.always({
      "with": {
        "description": "Resources related to this patient",
        "type": gTypes.root,
        "resolve": (root, args, ctx) => ({ "extraArgs": [`patient=${root.id}`]})
      }
    })
  ],
  [
    R.equals('Encounter'),
    R.always({
      "with": {
        "description": "Resources related to this encounter",
        "type": gTypes.root,
        "resolve": (root, args, ctx) => ({ "extraArgs": [`encounter=${root.id}`]})
      }
    })
  ]
])(item);

const resolveByGet = (root, args, ctx) => {
  const refs = R.compose(R.when(R.compose(R.not, R.isArrayLike), x => [x]), R.prop(ctx.fieldName))(root);
  const promises = R.map((ref) => {
    return new Promise((resolve, reject) => {
      const url = server + ref.reference;
      req.get(url, (err, res, body) => {
        resolve(JSON.parse(body));
      });
    });
  })(refs);

  return Promise.all(promises).then(r => {
    if (ctx.returnType instanceof GraphQLList) return r;
    if (r.length > 1) throw `Got list when expected a singleton ${root} ${ctx.fieldName}`;
    if (r.length === 1) return r[0];
    console.log("No result at");
    return null;
  });
};

const resolveBySearch = (root, args, ctx) => {
  const resource = ctx.returnType.ofType.name;
  const params = R.compose(
    R.join('&'),
    R.reduce((acc, item) => {
      const k = encodeURIComponent(item + (args[item].length === 1 ? '' : ":" + args[item][0]));
      const v = encodeURIComponent(args[item].length === 1 ?  args[item][0] : args[item][1] );
      return R.insert(R.Infinity, `${asFhirSearchParam(k)}=${v}`, acc);
    }, root && root.extraArgs || []),
    R.keys
  )(args);

  const promise = new Promise((resolve, reject) => {
    const url = server + resource + "?" + params;
    req.get(url, (err, res, body) => {
      const parsed = JSON.parse(body);
      const matches = parsed.entry ? R.map(R.prop('resource'))(parsed.entry) : [];
      resolve(matches);
    })
  })
};

const makeSchema = () => {
  const gTypes = R.reduce((acc, t) => R.assoc(t, fhirToGraphQL(t), acc), {}, fhirTypes);
  gTypes.Resource = gTypes.any = new GraphQLUnionType({
    name: "Any Resource",
    resolveType: typeOfResource,
    types: R.map(R.prop(R.__, gTypes), allResourcesNames)
  });
  gTypes.SearchParam = new GraphQLList(GraphQLString);

  const rootFields = R.compose(
    R.reduce((acc, item) => R.assoc(item[0], item[1], {}, acc)),
    R.map(r => [
      r, {
        type: new GraphQLList(gTypes[r]),
        description: `Get all resources of type ${r}`,
        args: R.reduce((acc, item) => R.assoc(item.fieldArgName, { description: item.description, type: gTypes.SearchParam }, acc), {}, searchParamsByType[r] || []),
        resolve: resolveBySearch
      }
    ])
  )(allResourcesNames);

  gTypes.root = new GraphQLObjectType({
    name: 'Query',
    fields: rootFields
  });

  const typeOfResource = R.compose(R.prop(R.__, gTypes), R.prop('resourceType'));
  const schemaTypes = (gqlTypes, structure) => {
    const keyLen = R.compose(R.prop('length'), R.replace(/[^\.]/gi, ""));

    const createUnionType = R.curry((acc, item) => {
      return new GraphQLUnionType({
        name: item,
        resolveType: typeOfResource,
        types: R.compose(
          R.map(R.prop(R.__, gTypes)),
          R.filter(R.compose(R.contains(R.__, ['any', 'Resource']))),
          R.chain(R.ifElse(R.propEq('code', 'Reference'), R.compose(R.map(resourceFromUri), R.prop('profile')), R.prop('code'))),
          R.path([item, 'type'])
        )(structures)
      });
    });

    const createObjectType = R.curry((acc, item) => {
      const struct = structures[item];
      const gqlObjectFields = (subItem) => {
        const name = R.compose(R.last, R.split("."))(subItem);
        let subStruct = R.prop(subItem, structure);

        if(!!subStruct.nameReference) {
          subItem = R.compose(R.prop(`${R.compose(R.head, R.split("."))(subpath)} ${substruct.nameReference}`), namesToPaths)(structure);
          subStruct = R.prop(subItem, structure);
        }

        const wrapList = R.ifElse(R.equals("*"), () => x => new GraphQLList(x), () => x => x)(subStruct.max);
        const isReference = R.compose(lengthGreaterThan(0), R.filter(R.equals('Reference')), R.map(R.prop('code')), R.prop('type'))(subStruct);
        const nextType = R.cond([
          [
            R.both(R.compose(R.equals(1), R.length), R.compose(R.propEq('code', 'Reference'), R.head)),
            R.compose(R.prop(R.__, gTypes), resourceFromUri, R.propOr('/any', 'profile'), R.head)
          ],
          [
            R.allPass([
              R.compose(R.equals(1), R.length),
              R.compose(R.not, R.either(R.equals('BackboneElement'), R.equals('Element')), R.prop('code'), R.head)
            ]),
            R.compose(R.propOr(`one-type no such ${item} ${subItem}`, R.__, gTypes), R.when(R.equals('*'), R.always('Resource')), R.prop('code'), R.head)
          ],
          [R.T, R.always(R.propOr(`default no such ${item} ${subItem}`, subItem, gTypes))]
        ])(R.prop('type', subStruct));

        return [
          name,
          {
            type: wrapList(nextType),
            description: subStruct.definition,
            resolve: isReference ? resolveByGet : undefined
          }
        ];
      };

      const gqlObject = new GraphQLObjectType({
        name: struct.path,
        description: struct.definition,
        fields: () => R.compose(
          R.reduce((acc, i) => R.assoc(i[0], i[1], acc), extraFieldsFor(gTypes, struct.path)),
          R.map(gqlObjectFields)
        )(R.propOr([], 'children', struct))
      });

      return R.assoc(item, acc[item] || gqlObject, acc);
    });

    const toSchemaTypes = (acc, item) => {
      R.cond([
        [R.compose(R.isNil, R.prop(item)), R.always(acc)],
        [R.compose(lengthGreaterThan(1), R.prop('type')), createUnionType(acc)],
        [R.T, createObjectType(acc)]
      ])(item);
    };

    return R.compose(
      R.reduce(toSchemaTypes, gqlTypes),
      R.sort((a, b) => R.subtract(keyLen(a), keyLen(b))),
      R.keys
    )(structure);
  }

  return new GraphQLSchema({
    query: gTypes.root
  });
};

function go() {
  const mergedStructures = R.compose(
    addChildren,
    R.assoc('code', structureCode),
    R.mergeAll
  )([importStructure(profileTypes), importStructure(profileResources)]);



  //const resourcesNames = allResourcesNames(mergedStructures);

  return Object.keys(mergedStructures).length;
}

console.log(go());

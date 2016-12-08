const R = require('ramda');
const Future = require('fluture');
const request = require('request');
const readline = require('readline');
const requestP = require('request-promise');
const Maybe = require('data.maybe');

const getPost = id =>
  Future.node(done => request(`https://jsonplaceholder.typicode.com/posts/${id}`, done))
  .map(x => x.body)
  .chain(Future.encase(JSON.parse));

const getPostP = id =>
  requestP(`https://jsonplaceholder.typicode.com/posts/${id}`)
  .then(x => x.body)
  .then(JSON.parse);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const toF = fn => Future.encase(fn);
const toP = fn => Promise.resolve(fn);

// rl.question('Enter post id', (id) => {
//   const fetchF = R.compose(R.map(R.prop('title')), getPost);
//   fetchF(1).fork(console.error, console.log);
//
//   rl.question('Enter another id', id2 => {
//     const r = R.traverse(getPost, Future.of, [id, id2]);
//     r.fork(console.error, console.log);
//     console.log(r);
//   });
// });

// const composeP = () => {
//   const rp = id => requestP(`https://jsonplaceholder.typicode.com/posts/${id}`).then(x => x.body);
//   const res = R.compose(
//     R.chain(JSON.parse),
//     rp
//   )(3);
//   console.log(res);
// };
// composeP();

const lift = () => {
  const obj = { name: "lucas", contact: { mobile: ["1", "2", "3"], home: [] } };
  const mobileProp = R.path(['contact', 'mobile']);
  const mObj = Maybe.fromNullable(obj);
  const res = mObj.map(mobileProp).chain(Maybe.fromNullable).map(R.head);
  console.log(res.getOrElse([]));
};
lift();

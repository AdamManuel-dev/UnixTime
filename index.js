const { ms, sec } = require('./UnixTime');

const l = (data) => console.log(data);

l`Checking to see ms eq sec x 1000`;

const one = ms(ms(ms('-60m')));
const two = ms(ms(sec('30')));

console.log(one, two);

l`Check to see if the two have`;

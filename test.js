const { Time, Unix } = require("./index");
const { ms, sec } = Unix;

const l = (data) => console.log(data);

l`Checking to see ms eq sec x 1000`;

const one = ms(ms(ms("-60m")));
const two = ms(ms(sec("30")));

console.log(one, two);

l`Check to see if the two have`;

const time = Time.fromMS(Date.now());
console.log(time.value); // Unix Time Seconds (Our Standard) since 1970
console.log(time.toString()); // toLocaleTimeString
console.log(time.time); // Unix time reset every midnight
console.log(new Time(1597659498, "UTC"));
console.log(Time.parseTime("3:30 AM").timeString());
console.log(Time.parseDate("10/24/2020").dateString());
console.log(Time.parseDate("10 - 24 - 2020").dateString());
console.log(
  Time.parseDateTime("8/17/2020, 3:40:04 AM")
    .changeTZ("Central")
    .changeTZ("UTC")
    .timeString()
);
console.log(Time.parseDateTime("2020-02-27 00:00:00.000").toString());
console.log(
  Time.thisHour().addMS("2 hours").subtractMS("5 minutes").toString()
);
console.log(Time.thisDay().ms);
console.log(Time.parseTime("noon").internalDate.getUTCHours());
console.log(Time.thisHour().internalDate.toLocaleTimeString());
console.log(Time.parseTime("3:30pm").fromTZ("Central").timeString());

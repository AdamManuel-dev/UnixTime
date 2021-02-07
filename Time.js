"use strict";
exports.__esModule = true;
var UnixTime_1 = require("./UnixTime");
var toSec = function (num) { return Math.floor(num / 1000); };
/**
 * A UnixSecond Native Date Object
 * @example
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
 */
var Time = /** @class */ (function () {
    function Time(unixTime, tz) {
        if (tz === void 0) { tz = "UTC"; }
        this.tz = tz;
        var numberLength = (unixTime + "").length;
        if (numberLength === 10) {
            // SEC
            this.unixTime = unixTime;
        }
        if (numberLength === 13) {
            // MS
            this.unixTime = Math.floor(unixTime / 1000);
        }
        if (numberLength === 16) {
            // MicroS
            this.unixTime = Math.floor(unixTime / 1000000);
        }
        switch (this.tz) {
            case "Central":
                this.unixTime += toSec(UnixTime_1.ms("5 hours"));
                break;
            case "Eastern":
                this.unixTime += toSec(UnixTime_1.ms("4 hours"));
                break;
            case "Western":
                this.unixTime += toSec(UnixTime_1.ms("7 hours"));
                break;
            case "UTC":
            default:
                break;
        }
        this.tz = "UTC";
    }
    Object.defineProperty(Time.prototype, "internalDate", {
        /**
         * Gets the JS Date Object from internal
         */
        get: function () {
            return new Date(this.ms);
        },
        /**
         *
         */
        set: function (date) {
            this.ms = date.valueOf();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Time.prototype, "value", {
        get: function () {
            return this.unixTime;
        },
        set: function (time) {
            this.unixTime = time;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Time.prototype, "time", {
        get: function () {
            return this.unixTime % Math.floor(UnixTime_1.ms("1 day") / 1000);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Time.prototype, "unixDate", {
        get: function () {
            return this.unixTime % Math.floor(UnixTime_1.ms("1 day") / 1000);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Time.prototype, "ms", {
        get: function () {
            var ms = this.unixTime * 1000;
            return ms;
        },
        set: function (input) {
            this.unixTime = Math.floor(input / 1000);
        },
        enumerable: true,
        configurable: true
    });
    Time.unit = function (unit, size) {
        return size === "ms"
            ? UnixTime_1.ms("1 " + unit)
            : Math.floor(UnixTime_1.ms("1 " + unit) / 1000);
    };
    Time.prototype.addMS = function (_ms) {
        if (typeof _ms === "string") {
            this.ms += UnixTime_1.ms(_ms);
        }
        else {
            this.ms += _ms;
        }
        return this;
    };
    Time.prototype.multiplyMS = function (_ms) {
        if (typeof _ms === "string") {
            this.ms *= UnixTime_1.ms(_ms);
        }
        else {
            this.ms *= _ms;
        }
        return this;
    };
    Time.prototype.divideMS = function (_ms) {
        if (typeof _ms === "string") {
            this.ms /= UnixTime_1.ms(_ms);
        }
        else {
            this.ms /= _ms;
        }
        return this;
    };
    Time.prototype.subtractMS = function (_ms) {
        if (typeof _ms === "string") {
            this.ms -= UnixTime_1.ms(_ms);
        }
        else {
            this.ms -= _ms;
        }
        return this;
    };
    Time.prototype.changeTZ = function (newTZ) {
        var change = 0;
        switch (this.tz) {
            case "Central":
                change -= 5;
                break;
            case "Eastern":
                change -= 4;
                break;
            case "Western":
                change -= 7;
                break;
            case "UTC":
            default:
                change -= 0;
                break;
        }
        switch (newTZ) {
            case "Central":
                change += 5;
                break;
            case "Eastern":
                change += 4;
                break;
            case "Western":
                change += 7;
                break;
            case "UTC":
            default:
                change += 0;
                break;
        }
        var changeInMS = this.ms - UnixTime_1.ms(change + " hours");
        this.ms = changeInMS;
        this.tz = newTZ;
        return this;
    };
    Time.prototype.toString = function () {
        return this.internalDate.toLocaleString();
    };
    Time.prototype.timeString = function () {
        return this.internalDate.toLocaleTimeString();
    };
    Time.prototype.dateString = function () {
        return this.internalDate.toDateString();
    };
    /**
     *
     * - It includes a space between time and time of day or NOT
     * - am or pm can be lowerCase or Uppercase
     * @param time
     * @example Time.parseTime('3:30AM')
     */
    Time.parseTime = function (time) {
        var total = 0;
        if (time.toLowerCase() === "noon") {
            total += UnixTime_1.ms("12 hours");
        }
        else if (time.toLowerCase() === "midnight") {
            total = 0;
        }
        else {
            var withoutSpaces = time.replace(/ /g, "");
            var _a = withoutSpaces.split(/\D+/g), hour = _a[0], minute = _a[1];
            var checkAMOrPM = function (str) {
                return time.toLowerCase().includes(str.toLowerCase());
            };
            if (checkAMOrPM("pm")) {
                total += UnixTime_1.ms("12 hours");
            }
            // console.log(ms(`${hour} hours`));
            total += UnixTime_1.ms(hour + " hours");
            total += UnixTime_1.ms(minute + " minutes");
        }
        // console.log(total);
        var unixDay = Math.floor(Date.now() / UnixTime_1.ms("24 hours"));
        var day = unixDay * UnixTime_1.ms("1 day");
        var toReturn = Time.fromMS(day + total);
        return toReturn;
    };
    Time.parseDate = function (time, options) {
        if (options === void 0) { options = {
            monthFirst: true,
            yearFirst: false
        }; }
        var _a = time.split(/\D+/g).slice(), day = _a[0], month = _a[1], year = _a[2];
        if (options.monthFirst) {
            _b = time.split(/\D+/g).slice(), month = _b[0], day = _b[1], year = _b[2];
        }
        else if (options.yearFirst) {
            _c = time.split(/\D+/g).slice(), year = _c[0], day = _c[1], month = _c[2];
        }
        else {
            _d = time.split(/\D+/g).slice(), day = _d[0], month = _d[1], year = _d[2];
        }
        var dayNumber = Number.parseInt(day);
        var monthNumber = Number.parseInt(month);
        var yearNumber = year.length === 2 ? Number.parseInt("20" + year) : Number.parseInt(year);
        // console.log(dayNumber, monthNumber, yearNumber);
        var total = Math.floor(Date.UTC(yearNumber, monthNumber - 1, dayNumber, 0, 0, 0, 0) / 1000);
        return new Time(total);
        var _b, _c, _d;
    };
    Time.prototype.fromTZ = function (tz) {
        return new Time(this.value, tz);
    };
    Time.addTimeToDate = function (time, date) {
        var timeStr = time.changeTZ("UTC").toString().split(", ")[1];
        var dateStr = date.changeTZ("UTC").toString().split(", ")[0];
        return Time.parseDateTime(dateStr + ", " + timeStr);
    };
    Time.parseDateTime = function (time) {
        var _time = decodeURI(time + "")
            .replace(/\%3A/g, ":")
            .replace(/\%20/g, " ");
        var dateTime = Date.parse(_time);
        var sec = Math.floor(dateTime / 1000);
        return new Time(sec);
    };
    Time.fromMS = function (time) {
        var sec = Math.floor(time / 1000);
        return new Time(sec);
    };
    Time.now = function () {
        return Time.fromMS(Date.now());
    };
    Time.thisHour = function () {
        var now = Date.now();
        return Time.fromMS(Math.floor(now / UnixTime_1.ms("1 hour")) * UnixTime_1.ms("1 hour"));
    };
    Time.thisDay = function () {
        var now = Date.now();
        return Time.fromMS(Math.floor(now / UnixTime_1.ms("1 day")) * UnixTime_1.ms("1 day"));
    };
    return Time;
}());
exports.Time = Time;

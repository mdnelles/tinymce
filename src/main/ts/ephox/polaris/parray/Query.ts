import { Arr, Option } from '@ephox/katamari';

/**
 * Simple "is position within unit" utility function
 */
const inUnit = function (unit, position) {
  return position >= unit.start() && position <= unit.finish();
};

/**
 * Finds the unit in the PositionArray that contains this offset (if there is one)
 */
const get = function (parray, offset) {
  return Arr.find(parray, function (x) {
    return inUnit(x, offset);
  });
};

const startindex = function (parray, offset) {
  return Arr.findIndex(parray, function (unit) {
    return unit.start() === offset;
  });
};

const tryend = function (parray, finish) {
  const finishes = parray[parray.length - 1] && parray[parray.length - 1].finish() === finish;
  return finishes ? parray.length + 1 : -1;
};

/**
 * Extracts the pieces of the PositionArray that are bounded *exactly* on the start and finish offsets
 */
const sublist = function (parray, start, finish) {
  const first = startindex(parray, start);
  const rawlast = startindex(parray, finish);
  return first.bind(function (fIndex) {
    const last = rawlast.getOr(tryend(parray, finish));
    return last > -1 ? Option.some(parray.slice(fIndex, last)) : Option.none();
  }).getOr([]);
};

const find = function (parray, pred) {
  return Arr.find(parray, pred);
};

export default <any> {
  get,
  find,
  inUnit,
  sublist
};
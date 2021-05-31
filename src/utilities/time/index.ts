//
// ─── CONST VAR ──────────────────────────────────────────────────────────────────
//
const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
// ────────────────────────────────────────────────────────────────────────────────

exports.calculateDayPassed = function (firstDate, secondDate) {
  return Math.round(Math.abs((firstDate - secondDate) / oneDay));
};

exports.isDateWithinDays = function (date, num_of_day) {
  /*const min_date_range = new Date(moment().subtract(14, 'days').calendar());
    const max_date_range = new Date(moment().add(14, 'days').calendar());*/
  const today = new Date();
  const day_passed = module.exports.calculateDayPassed(today, date);
  if (day_passed <= num_of_day) {
    return true;
  }
  return false;
};

exports.isAlreadyPassedPeriodOfDay = function (date, num_of_day) {
  const today = new Date();
  const day_passed = module.exports.calculateDayPassed(today, date);
  if (day_passed >= num_of_day) {
    return true;
  }
  return false;
};

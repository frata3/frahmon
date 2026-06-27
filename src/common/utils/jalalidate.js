import moment from "jalali-moment";
export const toPersianNumber = (value) => {
  if (value === null || value === undefined) return "";
  return value.toString().replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
};
export const toPersianDate = (date) => {
  if (!date) return "";
  const now = moment();
  const inputDate = moment(date);
  const jInput = moment(date).locale("fa");
  const diffYears = now.diff(inputDate, "years");
  if (diffYears >= 1) {
    return toPersianNumber(jInput.format("YYYY/MM/DD"));
  } else {
    return toPersianNumber(jInput.format("D MMMM")); 
  }
};
export const toPersianUnit = (unit) => {
  switch (unit) {
    case "g": return "گرم";
    case "kg": return "کیلوگرم";
    case "ml": return "میلی‌لیتر";
    case "l": return "لیتر";
    case "unit": return "عدد";
    default: return unit;
  }
};
export const toPersianRelative = (date) => {
  if (!date) return "";
  const relative = moment(date).locale("fa").fromNow();
  return toPersianNumber(relative);
};
export const toPersianPrice = (price) => {
  if (price === null || price === undefined || price === "") return "";

  const number = Number(price);
  if (isNaN(number)) return "";

  const formatted = number.toLocaleString("en-US");
  return toPersianNumber(formatted); 
};
export const getTodayPersianFull = () => {
  const now = moment().locale("fa");
  const formatted = `${now.format("dddd")} ${toPersianNumber(
    now.format("YYYY/MM/DD")
  )}`;
  return formatted;
};
export const registerJalaliHelpers = (req, res, next) => {
  res.locals.toPersianNumber = toPersianNumber;
  res.locals.toPersianDate = toPersianDate;
  res.locals.toPersianUnit = toPersianUnit;
  res.locals.toPersianRelative = toPersianRelative;
  res.locals.toPersianPrice = toPersianPrice;
  res.locals.getPersianTodayDate = getTodayPersianFull;
  next();
};
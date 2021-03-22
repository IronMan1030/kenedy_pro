export const getCurrentDate = () => {
  let today = new Date();
  let date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  return date;
};

export const getDateFromDuration = (duration) => {
  let date;
  let today = new Date();
  let numberOfDuration = duration.replace(/[^0-9]/g, "");
  if (duration.toLowerCase().search("month") !== -1) {
    today.setMonth(today.getMonth() + parseInt(numberOfDuration));
    date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  } else {
    today.setDate(today.getDate() + parseInt(numberOfDuration));
    date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  }
  return date;
};

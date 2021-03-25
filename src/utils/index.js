export const getCurrentDate = () => {
  let today = new Date();
  let date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  return date;
};

export const getDateFromDuration = (duration) => {
  let date;
  let today = new Date();
  // XXX original code
  // let numberOfDuration = duration.replace(/[^0-9]/g, "");
  // if (duration.toLowerCase().search("month") !== -1) {
  //   today.setMonth(today.getMonth() + parseInt(numberOfDuration));
  //   date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  // } else if (duration.toLowerCase().search("week") !== -1) {
  //   today.setDate(today.getDate() + parseInt(numberOfDuration) * 7);
  //   date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  // } else {
  //   today.setDate(today.getDate() + parseInt(numberOfDuration));
  //   date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  // }
  let count = parseInt(duration.replace(/[^0-9]/g, ""));
  let year = today.getFullYear();
  let month = today.getMonth(); //note 0-11
  let day = today.getDate();
  console.log("today: " + year + "-" + (month + 1) + "-" + day);

  let futureDate = new Date();

  if (duration.toLowerCase().search("year") !== -1) {
    date = year + count + "-" + (month + 1) + "-" + day;
    console.log("add " + count + " year(s) : " + date);
  } else if (duration.toLowerCase().search("month") !== -1) {
    let origCount = count;
    if (month + count >= 12) {
      while (count >= 12) {
        year += 1;
        count -= 12;
      }
      if (month + count >= 12) {
        year += 1;
        month = (month + count) % 12;
      } else {
        month += count;
      }
      date = year + "-" + (month + 1) + "-" + day;
    } else {
      date = year + "-" + (month + count + 1) + "-" + day;
    }
    console.log("add " + origCount + " month(s) : " + date);
  } else if (duration.toLowerCase().search("week") !== -1) {
    let timestamp = today.getTime() + count * 7000 * 3600 * 24;
    futureDate = new Date(timestamp);
    year = futureDate.getFullYear();
    month = futureDate.getMonth() + 1;
    day = futureDate.getDate();
    date = year + "-" + month + "-" + day;
    console.log("add " + count + " week(s) : " + date);
  } else if (duration.toLowerCase().search("day") !== -1) {
    let timestamp = today.getTime() + count * 1000 * 3600 * 24;
    futureDate = new Date(timestamp);
    year = futureDate.getFullYear();
    month = futureDate.getMonth() + 1;
    day = futureDate.getDate();
    date = year + "-" + month + "-" + day;
    console.log("add " + count + " day(s) : " + date);
  } else {
    console.log("warning: did not process: " + duration);
  }
  return date;
};

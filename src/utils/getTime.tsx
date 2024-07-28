import sliceTime from "./sliceTime";

const getTime = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();

  const nowDate = yyyy + "/" + sliceTime(mm) + "/" + sliceTime(dd);
  const nowTime = sliceTime(h) + ":" + sliceTime(m) + ":" + sliceTime(s);
  const eventDate = yyyy + "-" + sliceTime(mm) + "-" + sliceTime(dd);

  return { nowDate, nowTime, eventDate, dd };
};

export default getTime;

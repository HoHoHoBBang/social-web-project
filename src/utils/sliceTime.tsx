const sliceTime = (i: number) => {
  return ("00" + i.toString()).slice(-2);
};

export default sliceTime;

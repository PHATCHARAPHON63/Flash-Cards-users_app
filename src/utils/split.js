export const splitDot = (string) => {
  const temp = string.split('.');

  return temp.length > 1 ? temp[1] : temp[0];
};

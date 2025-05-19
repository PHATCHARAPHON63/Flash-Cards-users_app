const sliceText = (text, maxLength = 18) => {
  if (text?.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
};

export { sliceText };

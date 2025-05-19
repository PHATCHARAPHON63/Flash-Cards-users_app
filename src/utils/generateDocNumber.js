export const generateDocNumber = (reportItem) => {
  const docNumber = report?.happy_docs_code || report?.safety_docs_code || report?.covid_docs_code;

  if (reportItem.appeal?.details?.length > 0) {
    return `${docNumber}.${report.appeal?.details?.length}`;
  }

  return docNumber;
};

export const dedupResponses = (responses) => {
  return responses.filter((obj, index, self) => {
    return index === self.findIndex((t) => t.phone === obj.phone);
  });
};

export const cleanedPhoneNum = (num: string) => {
  if (!num) return "";
  return num.replace(/[^\d]/g, "");
};

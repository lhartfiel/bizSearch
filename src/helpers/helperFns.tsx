import { searchResultPlacesType } from "./constants";
export const dedupResponses = (responses: searchResultPlacesType[] | []) => {
  if (responses.length === 0) return [];
  const seenPhones = new Set<string | undefined | null>();
  return responses.filter((obj) => {
    const phone = obj.phone;
    if (!phone) return true;
    if (seenPhones.has(phone)) {
      return false;
    }
    seenPhones.add(phone);
    return true;
  });
};

export const cleanedPhoneNum = (num: string) => {
  if (!num) return "";
  return num.replace(/[^\d]/g, "").toString();
};

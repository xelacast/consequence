/**
 *
 * @param str can be one word or many words
 * @returns all words capitalized
 */
export const toCapitalize = (str: string) => {
  const strings = str.split(" ");
  const capitalized = strings
    .map((s) => {
      return s.substring(0, 1).toUpperCase() + s.substring(1);
    })
    .join(" ");
  return capitalized;
};

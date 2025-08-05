export const validateEmail = (str) => {
  const [local, domain] = str.split("@");
  if (!domain) return false;
  // eslint-disable-next-line no-unused-vars
  const [_, tld] = domain.split(".");
  return local?.length > 0 && tld?.length > 0;
};

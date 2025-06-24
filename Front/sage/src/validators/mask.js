export const cpfMask = (value) =>
  value
    ?.replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

export const dateMask = (value) =>
  value
    ?.replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1/$2");

export const phoneMask = (value) =>
  value
    ?.replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(\d{4})-(\d)(\d{4})/, "$1$2-$3")
    .replace(/(-\d{4})\d+?$/, "$1");

export const moneyMask = (value) => {
  let v = `${value}`?.replace(/\D/g, "");

  if (v / 100 > 999999999.99) {
    return `${value}`.substr(0, value.length - 1);
  }

  v = `${(v / 100).toFixed(2)}`;
  v = v.replace(".", ",");
  v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
  v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");

  return v;
};

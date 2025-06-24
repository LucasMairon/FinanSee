// Libs
import _ from "lodash";
import { parse, isValid, format } from "date-fns";

export const transformDate = (fullDate) => String(fullDate).substr(0, 10);

export const validateBirthDate = (birthDate) => {
  const bDate = parse(
    birthDate?.split(/[-/]/)?.join("/"),
    "dd/MM/yyyy",
    new Date()
  );

  return isValid(bDate); // && differenceInYears(Date.now(), bDate) >= 18 // 18+
};

export const checkCPF = (strCPF) => {
  if (!strCPF) {
    return false;
  }
  strCPF = strCPF.replace(/\.|-/g, "");
  let Soma;
  let Resto;
  Soma = 0;
  if (
    [
      "11111111111",
      "22222222222",
      "33333333333",
      "44444444444",
      "55555555555",
      "66666666666",
      "77777777777",
      "88888888888",
      "99999999999",
      "00000000000",
    ].includes(strCPF)
  ) {
    return false;
  }
  let i = 0;
  for (i = 1; i <= 9; i++) {
    Soma += parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  }
  Resto = (Soma * 10) % 11;

  if (Resto === 10 || Resto === 11) {
    Resto = 0;
  }
  if (Resto !== parseInt(strCPF.substring(9, 10))) {
    return false;
  }

  Soma = 0;
  for (i = 1; i <= 10; i++) {
    Soma += parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  }
  Resto = (Soma * 10) % 11;

  if (Resto === 10 || Resto === 11) {
    Resto = 0;
  }
  if (Resto !== parseInt(strCPF.substring(10, 11))) {
    return false;
  }

  return true;
};

export const isValidEmail = (email) => {
  if (!email) {
    return false;
  }
  const pattern =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  return email?.match(pattern) !== null;
};

export const isValidPhone = (phone) => {
  if (!phone) {
    return false;
  }
  const currentPhone = phone.replace(/\D/g, "");
  const invalidPhones = [
    "111111111",
    "911111111",
    "11111111",
    "222222222",
    "922222222",
    "22222222",
    "333333333",
    "933333333",
    "33333333",
    "444444444",
    "944444444",
    "44444444",
    "555555555",
    "955555555",
    "55555555",
    "666666666",
    "966666666",
    "66666666",
    "777777777",
    "977777777",
    "77777777",
    "888888888",
    "988888888",
    "88888888",
    "999999999",
    "999999999",
    "99999999",
    "000000000",
    "900000000",
    "00000000",
  ];
  const withoutDDD = String(currentPhone).substr(2, 9);
  const find = invalidPhones.indexOf(withoutDDD);

  return find === -1 && currentPhone?.length === 11;
};

const formatDate2 = (date) => {
  const dateTransformer = transformDate(date);
  const splitDate = dateTransformer?.split("-");

  return splitDate ? `${splitDate[2]}/${splitDate[1]}` : null;
};

export const renderCurrentDate = () => {
  const date = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  const dateSplit = date.split(" ");

  const hourSplit = dateSplit[1].split(":");

  const hour = `${hourSplit[0]}:${hourSplit[1]}h`;

  const dateCurrent = formatDate2(dateSplit[0]);

  return `${dateCurrent} às ${hour}` || "";
};

export const formatDate = (date) => {
  const dateTransformer = transformDate(date);
  const splitDate = dateTransformer?.split("-");

  return splitDate ? `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}` : null;
};

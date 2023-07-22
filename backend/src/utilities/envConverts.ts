export const envConvert = (value: string, type: "number" | "bool") => {
  switch (type) {
    case "number":
      let number: number = +value;
      return number;

    case "bool":
      let bool: boolean =
        value === "true" || value === "1" || value === "t" ? true : false;
      return bool;

    default:
      return value;
  }
};

const typeConverter = (type: string) => {
  if (type === "integer") return "number";
  return type;
};

export { typeConverter };

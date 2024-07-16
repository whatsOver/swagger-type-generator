const typeConverter = (type: string) => {
  if (type === "integer") return "number";
  if (!type) return "unknown";
  return type;
};

export { typeConverter };

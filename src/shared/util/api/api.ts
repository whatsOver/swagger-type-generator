export const checkPathStartWithHttp = (path: string) => {
  return path.startsWith("http://") || path.startsWith("https://");
};

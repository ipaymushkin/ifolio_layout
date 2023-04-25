export const generateBackground = ({src, type}) => {
  if (src) {
    if (type === "image") {
      return `url("${src}") no-repeat center center`;
    } else if (type === "color") {
      return src;
    }
  }
  return "";
};

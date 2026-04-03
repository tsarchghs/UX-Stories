export const compose = (...fns) => {
  if (!fns.length) {
    return (value) => value;
  }

  return fns.reduceRight(
    (previousFn, currentFn) => (...args) => currentFn(previousFn(...args)),
    (value) => value
  );
};

let previous = 0;

export function throttle(
  func: () => void,
  delay: number,
  {
    isFirstExecution,
  }: {
    isFirstExecution?: boolean;
  } = {
    isFirstExecution: false,
  }
) {
  return function (...args: any) {
    const now = Date.now();

    if (now - previous > delay) {
      if (isFirstExecution) {
        if (!previous) return (previous = now);
      }
      previous = now;
      func.apply(this, args);
    }
  };
}

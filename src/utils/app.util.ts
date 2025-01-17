export class AppUtil {
  static parseBool = (n) => n === true || n === 'true' || Number(n) === 1;

  static sleep = (ms, printLog = true) => {
    if (ms === 0) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    printLog && console.log(`Sleeping ${ms / 1000} seconds`);
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
}

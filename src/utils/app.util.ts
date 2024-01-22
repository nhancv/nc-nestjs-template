export class AppUtil {
  static parseBool = (n) => n === true || n === 'true' || Number(n) === 1;

  static sleep = (ms, printLog = true) => {
    if (ms === 0) return;
    printLog && console.log(`Sleeping ${ms / 1000} seconds`);
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
}

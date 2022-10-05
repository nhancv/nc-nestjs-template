export class AppUtil {
  static parseBool = (n) => n === true || n === 'true' || Number(n) === 1;
}

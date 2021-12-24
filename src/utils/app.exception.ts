export class AppException<T = any> {
  tag: string;
  e: T;

  constructor(tag: string, err: T) {
    this.tag = tag;
    this.e = err;
  }
}

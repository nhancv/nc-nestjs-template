export class AppException {
    tag: string;
    e: any;

    constructor(tag: string, e: any) {
        this.tag = tag;
        this.e = e;
    }
}

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppUtil = void 0;
const moment_1 = __importDefault(require("moment"));
const nanoid_1 = require("nanoid");
const bcrypt = __importStar(require("bcrypt"));
class AppUtil {
    static currentTime() {
        return moment_1.default.now();
    }
    static currentUTC() {
        return moment_1.default.utc();
    }
    static currentUTCUnix() {
        return this.currentUTC().unix();
    }
    static currentUTCTimestamp() {
        return this.currentUTC().toDate().getTime();
    }
    static nanoId() {
        return nanoid_1.nanoid();
    }
    static genFriendlyId(length = 9) {
        const nanoid = nanoid_1.customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', length);
        return nanoid().toUpperCase();
    }
    static encrypt(val, key) {
        const crypto = require('crypto');
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key.substr(0, 32).padStart(32, '*')), iv);
        let encrypted = cipher.update(val);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }
    static decrypt(encrypted, key) {
        const crypto = require('crypto');
        const textParts = encrypted.split(':');
        const ivPart = textParts.shift();
        if (ivPart) {
            const iv = Buffer.from(ivPart, 'hex');
            const encryptedText = Buffer.from(textParts.join(':'), 'hex');
            const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key.substr(0, 32).padStart(32, '*')), iv);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
        }
        return null;
    }
    static async hash(nonHashVal) {
        const saltOrRounds = await bcrypt.genSalt();
        return bcrypt.hash(nonHashVal, saltOrRounds);
    }
    static hashVerify(nonHashVal, hashedVal) {
        return bcrypt.compare(nonHashVal, hashedVal);
    }
}
exports.AppUtil = AppUtil;
//# sourceMappingURL=app.util.js.map
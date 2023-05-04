export class Validation {
  static Regex = {
    Phone: new RegExp(/^(((\+|)84)|0)([1-9]{1})([0-9]{8})\b/),
    IdentifiedCode: new RegExp(/^0\d{8}$|^0\d{11}$|^\d{9}$|^\d{12}$/),
    Password: new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/),
  };
}

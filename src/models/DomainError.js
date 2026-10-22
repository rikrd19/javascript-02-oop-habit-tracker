export const ERROR_CODES = {
  INVALID_NAME: "INVALID_NAME",
  INVALID_FREQUENCY: "INVALID_FREQUENCY",
  DUPLICATE_CHECKIN: "DUPLICATE_CHECKIN",
  INVALID_DATE: "INVALID_DATE",
  FUTURE_DATE: "FUTURE_DATE",
  INVALID_TARGET_MINUTES: "INVALID_TARGET_MINUTES",
};

export class DomainError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "DomainError";
    this.code = code;
  }
}

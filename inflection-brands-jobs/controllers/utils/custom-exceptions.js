export class ThrottlingException extends Error {
  constructor({
    message,
    nextAvailableAt,
    endpoint,
    userId,
    storeId
  }) {
    super(message);

    this.nextAvailableAt = nextAvailableAt;
    this.endpoint = endpoint;
    this.userId = userId;
    this.storeId = storeId;
  }
}
export class SPAPIErrorException extends Error {
  constructor({
    message,
    endpoint,
    userId,
    storeId
  }) {
    super(message);

    this.endpoint = endpoint;
    this.userId = userId;
    this.storeId = storeId;
  }
}

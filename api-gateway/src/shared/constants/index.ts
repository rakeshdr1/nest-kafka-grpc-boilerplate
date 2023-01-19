class Constants {
  readonly KAFKA_TOPICS = {
    AUTH: {},
    USER: {
      USER_CREATED: 'user-created',
    },
    ACTIVITY: {
      CREATE: 'create-activity',
      UPDATE: 'update-activity',
      REMOVE: 'remove-activity',
    },
  };
}

export const CONSTANTS = new Constants();

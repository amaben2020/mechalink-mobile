export const JobRequestStatuses = {
  ACCEPTED: 'ACCEPTED',
  NOTIFYING: 'NOTIFYING',
  DECLINED: 'DECLINED',
  ON_THE_WAY: 'ON_THE_WAY',
} as const;

export const JobStatuses = {
  //Mechanic has arrived destination and has started working on it
  IN_PROGRESS: 'IN_PROGRESS',
  // once mechanic has accepted and starts coming
  ON_THE_WAY: 'ON_THE_WAY',
  //Unaccepted job that's not attached yet to a mechanic
  NOTIFYING: 'NOTIFYING',
  COMPLETED: 'COMPLETED',
  // No mechanic could resolve the issue
  CANCELED: 'CANCELED',
} as const;

export const JobTimerStatuses = {
  RUNNING: 'RUNNING',
  NOT_STARTED: 'NOT_STARTED',
  APPROVED: 'APPROVED',
  STOPPED: 'STOPPED',
};

export const MechanicStatuses = {
  ACCEPTED: 'APPROVED',
  UNAPPROVED: 'UNAPPROVED',
  DECLINED: 'OUT_OF_SERVICE',
  BANNED: 'BANNED',
} as const;

export const UserRoles = {
  client: 'client',
  mechanic: 'mechanic',
  admin: 'admin',
} as const;

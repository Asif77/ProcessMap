const StepState = {
  None: 0,
  Active: 1,
  Completed: 2,
  Urgent: 3,
  Returned: 4,
  Aborted: 5,
  Overdue: 6,
  Resubmitable: 7,
  Unruly: 8,
  InQueue: 9,
  Failed: 10,
  Warning: 11,
  Delay: 12,
  Reassigned: 13,
  ReassignedLate: 14,
  ReassignedOverDue: 15,
  ReturnedLate: 16,
  ReturnedOverDue: 17,
  ActiveResubmitted: 18,
  Conferrred: 19,
  ConferredLate: 20,
  ConferredOverDue: 21,
  Resubmitted: 22,
  ResubmittedLate: 23,
  ResubmittedOverDue: 24,
  InQueueLate: 25,
  InQueueOverDue: 26,
  CompletedIncComp: 27,
  Skipped: 28,
  ActiveReturned: 29
};

const TaskStatuses = {
  TASK_STATUS_ABORTED: 7,
  TASK_STATUS_ACTIVE: 1,
  TASK_STATUS_COMPLETED: 3,
  TASK_STATUS_DELAYED: 18,
  TASK_STATUS_FAILED: 19,
  TASK_STATUS_INQUEUE: 13,
  TASK_STATUS_REJECTED: 4,
  TASK_STATUS_SKIPPED: 12
};

const TaskSubStatuses = {
  TASK_STATUS_ACTIVE_LATE: 0x1,
  TASK_STATUS_ACTIVE_OVERDUE: 0x2,
  TASK_STATUS_ACTIVE_REASSIGNED: 0x4,
  TASK_STATUS_ACTIVE_CONFERED: 0x8,
  TASK_STATUS_ACTIVE_RETURNED: 0x10,
  TASK_STATUS_ACTIVE_RESUBMITTED: 0x20,
  TASK_STATUS_COMPLETE_RETURNED: 0x1,
  TASK_STATUS_COMPLETE_FAILED: 0x2,
  TASK_STATUS_COMPLETE_INCIDENT_COMPLETE: 0x4,
  TASK_STATUS_COMPLETE_INCIDENT_ARCHIVED: 0x8
};

const RecipientTypes = {
  User: 0,
  Job: 1,
  Group: 2,
  Que: 3,
  Initiator: 4,
  Supervisor: 5,
  Manager: 6,
  DataCell: 7,
  SupervisorDataCell: 8,
  ManagerDataCell: 9,
  GroupWeighted: 10,
  GroupSequential: 11,
  SupervisorPrevStep: 12,
  ManagerPrevStep: 13,
  ChartName: 14,
  RelativeInitiator: 15,
  RelativePrev: 16,
  RelativeDataCell: 17,
  PublicUser: 18,
  SupervisorStepX: 19,
  ManagerStepX: 20,
  RecipientStepX: 21,
  FirstAvailOnlinePerson: 23,
  FloStationConnector: 24,
  RecipientPreviousStep: 25
};

const mapObjectSelection = {
  Pointer: 1,
  User: 2,
  Junction: 3,
  Link: 4,
  PublishMap: 5,
  NewMap: 6
};

const LocaleType = {
  Process: 0,
  Step: 1
};

export {
  StepState,
  TaskStatuses,
  TaskSubStatuses,
  RecipientTypes,
  mapObjectSelection,
  LocaleType
};

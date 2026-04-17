/**
 * Reminder Engine — Scheduling and trigger management for financial reminders
 */

export type ReminderType =
  | 'document_expiry'   // Identity doc / policy expiry
  | 'emi_due'           // Loan EMI upcoming
  | 'subscription'      // Subscription renewal
  | 'goal_milestone'    // Goal X% reached
  | 'tax_deadline'      // ITR filing deadline
  | 'insurance_renewal' // Policy renewal
  | 'goal_review'       // Quarterly goal review
  | 'custom';           // User-defined

export type ReminderFrequency = 'once' | 'daily' | 'weekly' | 'monthly' | 'annual';

export interface Reminder {
  id: string;
  type: ReminderType;
  title: string;
  description: string;
  dueDate: Date;
  frequency: ReminderFrequency;
  notifyDaysBefore: number;
  isActive: boolean;
  linkedEntityId?: string; // e.g., policyId, loanId, goalId
  createdAt: Date;
}

export interface ReminderTrigger {
  reminderId: string;
  triggerDate: Date;
  isDismissed: boolean;
}

/**
 * Calculate next trigger date for a reminder
 */
export function getNextTriggerDate(reminder: Reminder): Date {
  const triggerDate = new Date(reminder.dueDate);
  triggerDate.setDate(triggerDate.getDate() - reminder.notifyDaysBefore);
  return triggerDate;
}

/**
 * Check if a reminder should fire today
 */
export function shouldFireToday(reminder: Reminder): boolean {
  if (!reminder.isActive) return false;
  const trigger = getNextTriggerDate(reminder);
  const today = new Date();
  return (
    trigger.getFullYear() === today.getFullYear() &&
    trigger.getMonth() === today.getMonth() &&
    trigger.getDate() === today.getDate()
  );
}

/**
 * Get all reminders that are due within N days
 */
export function getUpcomingReminders(reminders: Reminder[], withinDays: number): Reminder[] {
  const today = new Date();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + withinDays);

  return reminders.filter(r => {
    if (!r.isActive) return false;
    const trigger = getNextTriggerDate(r);
    return trigger >= today && trigger <= cutoff;
  }).sort((a, b) => getNextTriggerDate(a).getTime() - getNextTriggerDate(b).getTime());
}

/**
 * Get overdue reminders
 */
export function getOverdueReminders(reminders: Reminder[]): Reminder[] {
  const today = new Date();
  return reminders.filter(r => {
    if (!r.isActive) return false;
    return new Date(r.dueDate) < today;
  });
}

/**
 * Create a document expiry reminder from an identity doc
 */
export function createDocExpiryReminder(params: {
  docId: string;
  docType: string;
  docName: string;
  expiryDate: Date;
}): Omit<Reminder, 'id' | 'createdAt'> {
  return {
    type: 'document_expiry',
    title: `${params.docType.toUpperCase()} Expiry Alert`,
    description: `Your ${params.docName} expires on ${params.expiryDate.toLocaleDateString('en-IN')}`,
    dueDate: params.expiryDate,
    frequency: 'once',
    notifyDaysBefore: 30,
    isActive: true,
    linkedEntityId: params.docId,
  };
}

/**
 * Format a reminder for display
 */
export function formatReminderDueText(reminder: Reminder): string {
  const daysLeft = Math.ceil(
    (new Date(reminder.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  if (daysLeft < 0) return `Overdue by ${Math.abs(daysLeft)} days`;
  if (daysLeft === 0) return 'Due today';
  if (daysLeft === 1) return 'Due tomorrow';
  if (daysLeft <= 7) return `Due in ${daysLeft} days`;
  if (daysLeft <= 30) return `Due in ${Math.ceil(daysLeft / 7)} weeks`;
  return `Due in ${Math.ceil(daysLeft / 30)} months`;
}

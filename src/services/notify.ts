import { Notify } from 'quasar';

function makeNotification(notificationType: string, message: string) {
  Notify.create({
    type: notificationType,
    position: 'top',
    message,
  });
}
export function positiveNotification(message: string) {
  makeNotification('positive', message);
}

export function negativeNotification(message: string) {
  makeNotification('negative', message);
}

export function warningNotification(message: string) {
  makeNotification('warning', message);
}

export function infoNotification(message: string) {
  makeNotification('info', message);
}

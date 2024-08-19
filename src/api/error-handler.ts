import axios, { AxiosError, AxiosResponse } from 'axios';
import { negativeNotification } from 'src/services/notify';

const defaultErrorMessage = 'There was an error!';
const forbiddenErrorMessage = 'You do not have enough permissions to perform this action.';

export default function errorHandler(error: AxiosError | unknown, notify = true): AxiosResponse | undefined {
  if (axios.isAxiosError(error)) {
    const { response, request } = error;
    if (notify) {
      const message = response?.status === 403 ? forbiddenErrorMessage : defaultErrorMessage;
      if (!response || response.status !== 404) {
        negativeNotification(message);
      }
    }
    return response ?? request;
  }
  if (notify) {
    negativeNotification(defaultErrorMessage);
  }
  return undefined;
}

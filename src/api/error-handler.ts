import axios, { AxiosError, AxiosResponse } from 'axios';
import { negativeNotification } from 'src/services/notify';

const defaultErrorMessage = 'There was an error!';

export default function errorHandler(error: AxiosError | unknown, notify = true): AxiosResponse | undefined {
  if (axios.isAxiosError(error)) {
    const { response, request } = error;
    if (notify && (!response || response.status !== 404)) {
      negativeNotification(defaultErrorMessage);
    }
    return response ?? request;
  }
  if (notify) {
    negativeNotification(defaultErrorMessage);
  }
  return undefined;
}

import axios, { AxiosError, AxiosResponse } from 'axios';
import { negativeNotification } from 'src/services/notify';

const message = 'There was an error!';

export default function errorHandler(error: AxiosError|unknown): AxiosResponse | undefined {
  if (axios.isAxiosError(error)) {
    const axiosError: AxiosError = error;
    if (axiosError.response) {
      if (axiosError.response.status !== 404) {
        negativeNotification(message);
      }
      return axiosError.response;
    } if (axiosError.request) {
      negativeNotification(message);
      return axiosError.request;
    }
    negativeNotification(message);
    return undefined;
  }
  return undefined;
}

import { copyToClipboard, openURL } from 'quasar';
import { positiveNotification, negativeNotification } from 'src/services/notify';

export function numeralizeId(value: string | number): number {
  return Number(value);
}

export function getAspectRatio(width: number, height: number): number | undefined {
  if (width <= 0 || height <= 0) {
    // handle situations where the dimensions are null
    return undefined;
  }
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const commonDivisor = gcd(width, height);
  const reducedWidth = width / commonDivisor;
  const reducedHeight = height / commonDivisor;
  return reducedWidth / reducedHeight;
}

export function calculateSize(fileSize: number | undefined) {
  if (!fileSize) { return 'No File Size'; }
  const kilobytes = 1024;
  const megabytes = kilobytes * 1024;
  const gigabytes = megabytes * 1024;
  if (fileSize >= gigabytes) {
    return `${(fileSize / gigabytes).toFixed(2)} GB`;
  } if (fileSize >= megabytes) {
    return `${(fileSize / megabytes).toFixed(2)} MB`;
  } if (fileSize >= kilobytes) {
    return `${(fileSize / kilobytes).toFixed(2)} KB`;
  }
  return `${fileSize} bytes`;
}

export function copyLink(link: string | undefined) {
  if (link) {
    copyToClipboard(link)
      .then(() => {
        positiveNotification('Copied link to Clipboard');
      })
      .catch(() => {
        negativeNotification('Error Copying Link');
      });
  }
}

export function openLink(link: string | undefined) {
  if (link) {
    openURL(link);
  }
}

import { notification } from 'antd';
import { getAppContainer } from '../../../helpers/elementHelper';

type NotificationType = {
  type: 'open' | 'success' | 'info' | 'warning' | 'error';
  message: string;
  description?: string;
  duration?: number;
};

const showNotification = ({
  type,
  message,
  description = '',
  duration = 10,
}: NotificationType) => {
  notification[type]({
    message,
    description,
    duration,
    getContainer: getAppContainer,
  });
};

export default showNotification;

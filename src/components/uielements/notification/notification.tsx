import { notification } from 'antd';

import { getAppContainer } from 'helpers/elementHelper';

type NotificationType = {
  type: 'open' | 'success' | 'info' | 'warning' | 'error';
  message: string;
  description?: React.ReactNode;
  duration?: number;
  btn?: React.ReactNode;
};

const showNotification = ({
  type,
  message,
  description = '',
  duration = 10,
  btn,
}: NotificationType) => {
  notification[type]({
    message,
    description,
    duration,
    btn,
    getContainer: getAppContainer,
  });
};

export default showNotification;

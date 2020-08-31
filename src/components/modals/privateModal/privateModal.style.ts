import styled from 'styled-components';
import { palette } from 'styled-theme';
import Modal from '../../uielements/modal';

export const StyledModal = styled(Modal)`
  .ant-modal-body {
    .ant-form-item {
      margin-bottom: 0;
    }
  }
`;

export const ModalContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: ${palette('text', 2)};
`;

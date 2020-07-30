import React, { useMemo } from 'react';
import { Row } from 'antd';
import { FullscreenExitOutlined, CloseOutlined } from '@ant-design/icons';

import StepBar from '../../uielements/stepBar';
import TxTimer from '../../uielements/txTimer';
import Button from '../../uielements/button';
import CoinData from '../../uielements/coins/coinData';
import Trend from '../../uielements/trend';

import { StyledModal, ModalContent } from './confirmModal.style';

import { getTickerFormat } from '../../../helpers/stringHelper';
import { TxStatus, TxResult, TxTypes } from '../../../redux/app/types';
import { TESTNET_TX_BASE_URL } from '../../../helpers/apiHelper';
import { MAX_VALUE } from '../../../redux/app/const';

type Props = {
  txStatus: TxStatus;
  txResult: TxResult;
  onClose?: () => void;
};

const ConfirmModal: React.FC<Props> = (props): JSX.Element => {
  const { txStatus, txResult, onClose } = props;
  const { modal, status, value, hash, startTime, txData, type: txType } = txStatus;
  const { sourceAsset, sourceAmount, targetAsset, targetAmount, slip } = txData;
  const txURL = TESTNET_TX_BASE_URL + hash;

  const source = getTickerFormat(sourceAsset);
  const target = getTickerFormat(targetAsset);
  const refunded = txType === TxTypes.SWAP && txResult.type === 'refund';

  // check if tx has completed or not
  const isCompleted: boolean = useMemo(() => {
    if (txType === TxTypes.STAKE || txType === TxTypes.CREATE) {
      return !status;
    } else if (txType === TxTypes.WITHDRAW || txType === TxTypes.SWAP) {
      if (txResult.status && !status) return true;
      return false;
    }
    return false;
  }, [status, txType, txResult]);

  const modalTitle: string = useMemo(() => {
    if (txType === TxTypes.SWAP) {
      if (!isCompleted) return 'YOU ARE SWAPPING';
      if (refunded) return 'TOKEN REFUNDED';
      return 'YOU SWAPPED';
    } else if (txType === TxTypes.CREATE) {
      if (!isCompleted) return 'CREATING POOL';
      return 'POOL CREATED';
    } else if (txType === TxTypes.STAKE) {
      if (!isCompleted) return 'YOU ARE STAKING';
      return 'YOU STAKED';
    } else if (txType === TxTypes.WITHDRAW) {
      if (!isCompleted) return 'YOU ARE WITHDRAWING';
      return 'YOU WITHDRAWN';
    }
    return '';
  }, [txType, isCompleted, refunded]);

  const closeIcon = status ? (
    <FullscreenExitOutlined style={{ color: '#fff' }} />
  ) : (
    <CloseOutlined style={{ color: '#fff' }} />
  );

  const renderContent = () => {
    return (
      <ModalContent>
        <Row className="modal-content">
          <div className="timer-container">
            <TxTimer
              status={status}
              value={value}
              maxValue={MAX_VALUE}
              maxSec={45}
              startTime={startTime}
              refunded={refunded}
            />
          </div>
          <div className="asset-data-container">
            <StepBar size={50} />
            <div className="asset-pair">
              <CoinData asset={source} assetValue={sourceAmount} />
              <CoinData asset={target} assetValue={targetAmount} />
            </div>
          </div>
        </Row>
        <Row className="modal-info-container">
          {!!slip && <Trend amount={slip} />}
          <div className="modal-actions-container">
            <div className="modal-actions-col">
              {isCompleted && (
                <Button className="view-btn" color="success" onClick={onClose}>
                  FINISH
                </Button>
              )}
              {hash && (
                <a href={txURL} target="_blank" rel="noopener noreferrer">
                  VIEW TRANSACTION
                </a>
              )}
            </div>
          </div>
        </Row>
      </ModalContent>
    );
  };

  return (
    <StyledModal
      title={modalTitle}
      visible={modal}
      closeIcon={closeIcon}
      onCancel={onClose}
      footer={null}
    >
      {renderContent()}
    </StyledModal>
  );
};

export default ConfirmModal;

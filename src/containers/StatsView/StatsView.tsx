import React, { useCallback } from 'react';


import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Row, Col } from 'antd';

import Label from 'components/uielements/label';
import StatusGroup from 'components/uielements/statusGroup';
import WalletButton from 'components/uielements/walletButton';

import { RootState } from 'redux/store';
import { User } from 'redux/wallet/types';

import { Maybe, FixmeType } from 'types/bepswap';

import { stats } from './data';
import { ContentWrapper } from './StatsView.style';

type Props = {
  user: Maybe<User>;
};

type Field = {
  title: string;
  key: string;
  value: FixmeType;
};

const StatsView: React.FC<Props> = (props: Props): JSX.Element => {
  const getValues = useCallback(
    fields => {
      const { user } = props;

      if (!user) {
        return [];
      } else {
        return fields.map((field: Field) => {
          const { title, value } = field;
          return {
            title,
            value,
          };
        });
      }
    },
    [props],
  );

  return (
    <ContentWrapper>
      {(!props.user || !props.user.wallet) && (
        <div className="share-placeholder-wrapper">
          <Label className="placeholder-label">
            Please connect your wallet to check stats.
          </Label>
          <Link to="/connect">
            <WalletButton connected={false} />
          </Link>
        </div>
      )}
      {props.user && props.user.wallet && (
        <Row>
          <Col span={12}>
            <StatusGroup title="users" status={getValues(stats.users)} />
            <StatusGroup title="pools" status={getValues(stats.pools)} />
          </Col>
          <Col span={12}>
            <StatusGroup
              title="transactions"
              status={getValues(stats.transactions)}
            />
            <StatusGroup title="members" status={getValues(stats.stakers)} />
          </Col>
        </Row>
      )}
    </ContentWrapper>
  );
};

export default connect((state: RootState) => ({
  user: state.Wallet.user,
}))(StatsView);

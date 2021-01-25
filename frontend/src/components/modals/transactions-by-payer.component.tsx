import React, {useState} from 'react';
import {Checkbox, Empty, message, Modal, Tooltip} from 'antd';
import {IState} from '../../store';
import {connect} from 'react-redux';
import './modals.styles.less';
import TransactionItem from '../project-item/transaction-item.component';
import {Transaction} from '../../features/transactions/interface';
import {User} from '../../features/group/interface';
import {CheckSquareTwoTone, CloseSquareTwoTone, DeleteTwoTone,} from '@ant-design/icons';
import {deleteTransactions} from '../../features/transactions/actions';
import {Project} from '../../features/project/interface';
import {ProjectItemUIType} from "../../features/project/constants";

type TransactionsByPayerProps = {
  project: Project | undefined;
  transactionsByPayer: Transaction[];
  visible: boolean;
  payer: User | undefined;
  onCancel: () => void;
  deleteTransactions: (projectId: number, transactions: Transaction[], type: ProjectItemUIType) => void;
};

const TransactionsByPayer: React.FC<TransactionsByPayerProps> = (props) => {
  const {
    project,
    visible,
    payer,
    transactionsByPayer,
    deleteTransactions,
  } = props;
  const [checkboxVisible, setCheckboxVisible] = useState(false);
  const [checked, setChecked] = useState([] as Transaction[]);
  const onCheck = (t: Transaction) => {
    if (checked.includes(t)) {
      setChecked(checked.filter((c) => c !== t));
      return;
    }

    setChecked(checked.concat([t]));
  };

  const getList = () => {
    return transactionsByPayer.map((transaction, index) => {
      return (
        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          {checkboxVisible && (
            <Checkbox
              checked={checked.includes(transaction)}
              key={transaction.id}
              style={{ marginRight: '0.5rem', marginTop: '-0.5em' }}
              onChange={(e) => onCheck(transaction)}
            />
          )}
          <TransactionItem
            transaction={transaction}
            type={ProjectItemUIType.PAYER}
            inModal={true}
            inProject={false}
          />
        </div>
      );
    });
  };

  const selectAll = () => {
    setCheckboxVisible(true);
    setChecked([...transactionsByPayer]);
  };

  const clearAll = () => {
    setCheckboxVisible(true);
    setChecked([]);
  };

  const deleteAll = () => {
    if (project === undefined) {
      return;
    }

    setCheckboxVisible(true);
    if (checked.length === 0) {
      message.error('No Selection');
      return;
    }

    deleteTransactions(project.id, checked, ProjectItemUIType.PAYER);
    setChecked([] as Transaction[]);
  };

  return (
    <Modal
      title={`Paid by ${payer ? payer.alias : ''}`}
      visible={visible}
      onCancel={props.onCancel}
      footer={false}
    >
      {transactionsByPayer.length === 0 ? (
        <Empty />
      ) : (
        <div>
          <div className='checkbox-actions'>
            <Tooltip title='Select All'>
              <CheckSquareTwoTone onClick={selectAll} />
            </Tooltip>
            <Tooltip title='Clear All'>
              <CloseSquareTwoTone onClick={clearAll} />
            </Tooltip>
            <Tooltip title='Delete All'>
              <DeleteTwoTone twoToneColor='#f5222d' onClick={deleteAll} />
            </Tooltip>
          </div>
          <div>{getList()}</div>
        </div>
      )}
    </Modal>
  );
};

const mapStateToProps = (state: IState) => ({
  transactionsByPayer: state.transaction.transactionsByPayer,
  project: state.project.project,
});

export default connect(mapStateToProps, { deleteTransactions })(
  TransactionsByPayer
);

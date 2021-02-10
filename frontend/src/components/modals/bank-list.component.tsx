import React, {useState} from 'react';
import {Button, Empty, Modal, Result, Tooltip} from 'antd';
import {IState} from '../../store';
import {connect} from 'react-redux';
import './modals.styles.less';
import {BankTwoTone,} from '@ant-design/icons';
import {getBankAccounts} from "../../features/myself/actions";
import {BankAccount} from "../../features/transactions/interface";
import BankAccountElem from "../settings/bank-account";
import {useHistory} from "react-router-dom";

const LocaleCurrency = require('locale-currency');

type BankListProps = {
    getBankAccounts: () => void;
    currency: string;
    bankAccounts: BankAccount[];
};

const BankList: React.FC<BankListProps> = (
    {
        bankAccounts,
        currency,
        getBankAccounts,
    }) => {
    const history = useHistory();
    const [visible, setVisible] = useState(false);

    const openModal = () => {
        setVisible(true);
    };

    const getList = () => {
        if (bankAccounts.length === 0) {
            return <Result
                icon={<Empty />}
                title="No bank account added yet"
                extra={<Button type="primary" onClick={() => history.push('/bank')}>Add One</Button>}
            />
        }

        return <div>
            {bankAccounts.map(bankAccount => <BankAccountElem key={bankAccount.id}
                                                              mode='single'
                                                              bankAccount={bankAccount}/>)}
        </div>
    }

    const getModal = () => {
        return (
            <Modal
                destroyOnClose
                centered
                title={`Total Balance: ${bankAccounts.map(b => b.netBalance).reduce((a, b) => a + b, 0).toFixed(2)}
                ${LocaleCurrency.getCurrency(currency)}`}
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={false}
            >
                {getList()}
            </Modal>)
    }

    return (
        <>
            <Tooltip title="Bank" placement='top'>
                <div>
                    <BankTwoTone twoToneColor="#a17f1a" onClick={openModal}/>
                </div>
            </Tooltip>
            {getModal()}
        </>
    );
};

const mapStateToProps = (state: IState) => ({
    bankAccounts: state.myself.bankAccounts,
    currency: state.myself.currency
});

export default connect(mapStateToProps, {getBankAccounts})(BankList);

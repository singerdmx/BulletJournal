import {BankAccount, BankAccountType, Transaction} from "../../features/transactions/interface";
import {
    BankOutlined,
    CheckOutlined,
    CloseOutlined,
    CreditCardOutlined,
    DeleteOutlined,
    DollarCircleFilled,
    DollarCircleOutlined,
    FileSearchOutlined,
} from "@ant-design/icons";
import React from "react";
import {stringToRGB} from "../../utils/Util";
import {Statistic, Switch, Tag, Tooltip} from "antd";
import './bank.styles.less';
import {IState} from "../../store";
import {connect} from "react-redux";
import {updateTransactionBankAccount} from "../../features/transactions/actions";
import {useHistory} from "react-router-dom";
import {deleteBankAccount, getBankAccounts} from '../../features/myself/actions';
import EditBankAccountModal from '../modals/edit-bank.component'

const LocaleCurrency = require('locale-currency');

export const getBankAccountType = (input: string) => {
    switch (input) {
        case 'CHECKING_ACCOUNT':
            return BankAccountType.CHECKING_ACCOUNT;
        case 'SAVING_ACCOUNT':
            return BankAccountType.SAVING_ACCOUNT;
        case 'CREDIT_CARD':
            return BankAccountType.CREDIT_CARD;
        default:
            throw Error(`Invalid BankAccountType ${input}`);
    }
}

export const getBankAccountTypeIcon = (type: BankAccountType) => {
    switch (type) {
        case BankAccountType.CHECKING_ACCOUNT:
            return <DollarCircleOutlined/>;
        case BankAccountType.SAVING_ACCOUNT:
            return <BankOutlined/>;
        case BankAccountType.CREDIT_CARD:
            return <CreditCardOutlined/>;
        default:
            throw Error(`Invalid BankAccountType ${type}`);
    }
}

type BankAccountProps = {
    bankAccount: BankAccount;
    mode: string;
    currency: string;
    transaction: Transaction | undefined;
    getBankAccounts: () => void;
    updateTransactionBankAccount: (
        transactionId: number,
        bankAccount: number | undefined
    ) => void;
    deleteBankAccount: (id: number) => void;
}

const BankAccountElem: React.FC<BankAccountProps> = (
    {
        bankAccount,
        mode,
        transaction,
        currency,
        updateTransactionBankAccount,
        deleteBankAccount,
        getBankAccounts
    }) => {
    const history = useHistory();

    function onChange(checked: boolean, bankAccountId: number) {
        if (!transaction) {
            return;
        }
        if (checked) {
            updateTransactionBankAccount(transaction.id, bankAccountId);
        } else {
            updateTransactionBankAccount(transaction.id, undefined);
        }
    }

    const color = stringToRGB(bankAccount.name);
    const icon = getBankAccountTypeIcon(bankAccount.accountType);
    const balanceColor = bankAccount.netBalance >= 0 ? '#3f8600' : '#cf1322';

    const getColor = (type: BankAccountType) => {
        switch (type) {
            case BankAccountType.CHECKING_ACCOUNT:
                return '#F4F4F4';
            case BankAccountType.SAVING_ACCOUNT:
                return '#FFFAF3';
            case BankAccountType.CREDIT_CARD:
                return '#EEF4F9';
            default:
                throw Error(`Invalid BankAccountType ${type}`);
        }
    }
    let description = bankAccount.accountNumber ? bankAccount.accountNumber + ' ' : '';
    if (bankAccount.description) {
        description += bankAccount.description;
    }
    if (mode === 'card') {
        return <div className='bank-account-card' style={{backgroundColor: getColor(bankAccount.accountType)}}>
            <h1 className="bank-account-card-title" style={{color: color}}
                onClick={() => history.push(`/bank/${bankAccount.id}`)}>
                {bankAccount.name}
            </h1>

            <span className="bank-account-card-balance" onClick={() => history.push(`/bank/${bankAccount.id}`)}>
                <Statistic
                    value={`${bankAccount.netBalance.toFixed(2)} ${LocaleCurrency.getCurrency(currency)}`}
                    valueStyle={{color: balanceColor}}
                />
            </span>

            <div className="bank-account-card-description"
                 onClick={() => history.push(`/bank/${bankAccount.id}`)}>{description}</div>

            <div className="bank-account-card-operations">
                <Tooltip title='View Transactions'>
                    <FileSearchOutlined key="View Transactions" title='View Transactions'
                                        onClick={() => history.push(`/bank/${bankAccount.id}`)}/>
                </Tooltip>
                <EditBankAccountModal bankAccount={bankAccount} mode='card'
                                      onChangeBalanceSuccess={getBankAccounts}/>
                <Tooltip title='Delete'>
                    <DeleteOutlined key='Delete' title='Delete'
                                    onClick={() => deleteBankAccount(bankAccount.id)}/>
                </Tooltip>
            </div>
        </div>
    }

    let bankTitle = <span className='bank-name'>{icon} {bankAccount.name} {bankAccount.accountNumber}</span>

    if (bankAccount.description) {
        bankTitle = <Tooltip title={bankAccount.description} placement='left'>
            {bankTitle}
        </Tooltip>
    }

    if (mode === 'single') {
        return <div className='bank-account-single' style={{color: color}}>
            {bankTitle}
            {'   '}
            <Tag style={{color: balanceColor}}>{bankAccount.netBalance.toFixed(2)}</Tag>
            <Switch
                checkedChildren={<CheckOutlined/>}
                unCheckedChildren={<CloseOutlined/>}
                checked={transaction && transaction.bankAccount && transaction.bankAccount.id === bankAccount.id}
                onChange={(checked) => onChange(checked, bankAccount.id)}
            />
        </div>
    }

    if (mode === 'banner') {
        return <div className='bank-account-banner' style={{color: color}}
                    onClick={() => history.push(`/bank/${bankAccount.id}`)}>
            {bankTitle}
        </div>
    }

    if (mode === 'title') {
        return <div className='bank-account-title' style={{color: color}}>
            {bankTitle}
            {'   '}
            <span style={{color: balanceColor}}><DollarCircleFilled /> {bankAccount.netBalance.toFixed(2)} {LocaleCurrency.getCurrency(currency)}</span>
        </div>
    }

    if (mode === 'dropdown') {
        return <div className='bank-account-dropdown' style={{color: color}}>
            {bankTitle}
        </div>
    }

    return <div/>
}

const mapStateToProps = (state: IState) => ({
    transaction: state.transaction.transaction,
    currency: state.myself.currency
});

export default connect(mapStateToProps, {
    updateTransactionBankAccount,
    deleteBankAccount,
    getBankAccounts
})(
    BankAccountElem
);
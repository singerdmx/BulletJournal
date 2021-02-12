import {BankAccount, BankAccountType, Transaction} from "../../features/transactions/interface";
import {
    BankOutlined,
    CheckOutlined,
    CloseOutlined,
    CreditCardOutlined,
    DeleteOutlined, DollarCircleFilled,
    DollarCircleOutlined,
    EditOutlined,
    FileSearchOutlined,
} from "@ant-design/icons";
import React from "react";
import {stringToRGB} from "../../utils/Util";
import {Card, Statistic, Switch, Tag, Tooltip} from "antd";
import './bank.styles.less';
import {IState} from "../../store";
import {connect} from "react-redux";
import {updateTransactionBankAccount} from "../../features/transactions/actions";
import {useHistory} from "react-router-dom";

const {Meta} = Card;

const LocaleCurrency = require('locale-currency');

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

const getBankAccountTypeImage = (type: BankAccountType) => {
    switch (type) {
        case BankAccountType.CHECKING_ACCOUNT:
            return 'https://user-images.githubusercontent.com/122956/107489586-a5934000-6b3d-11eb-9802-f65fa433e07a.png';
        case BankAccountType.SAVING_ACCOUNT:
            return 'https://user-images.githubusercontent.com/122956/107489658-be9bf100-6b3d-11eb-90f8-807c2a718fc4.png';
        case BankAccountType.CREDIT_CARD:
            return 'https://user-images.githubusercontent.com/122956/107581636-3ce3ac00-6bad-11eb-8cb7-002428274e26.png';
        default:
            throw Error(`Invalid BankAccountType ${type}`);
    }
}

type BankAccountProps = {
    bankAccount: BankAccount;
    mode: string;
    currency: string;
    transaction: Transaction | undefined;
    updateTransactionBankAccount: (
        transactionId: number,
        bankAccount: number | undefined
    ) => void;
}

const BankAccountElem: React.FC<BankAccountProps> = (
    {
        bankAccount,
        mode,
        transaction,
        currency,
        updateTransactionBankAccount
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
    const image = getBankAccountTypeImage(bankAccount.accountType);
    const balanceColor = bankAccount.netBalance >= 0 ? '#3f8600' : '#cf1322';
    let description = bankAccount.accountNumber ? bankAccount.accountNumber + ' ' : '';
    if (bankAccount.description) {
        description += bankAccount.description;
    }
    if (mode === 'card') {
        return <div className='bank-account-card'>
            <Card
                key={bankAccount.id}
                style={{width: 280}}
                cover={
                    <img
                        alt={bankAccount.accountType}
                        src={image}
                    />
                }
                title={<span style={{color: color}}>{bankAccount.name}</span>}
                actions={[
                    <Tooltip title='View Transactions'>
                        <FileSearchOutlined key="View Transactions" title='View Transactions'
                                            onClick={() => history.push(`/bank/${bankAccount.id}`)}/>
                    </Tooltip>,
                    <Tooltip title='Edit'>
                        <EditOutlined key='Edit' title='Edit'/>
                    </Tooltip>,
                    <Tooltip title='Delete'>
                        <DeleteOutlined key='Delete' title='Delete'/>
                    </Tooltip>
                ]}
            >
                <Meta
                    style={{height: 65}}
                    title={<Statistic
                        value={`${bankAccount.netBalance} ${LocaleCurrency.getCurrency(currency)}`}
                        valueStyle={{color: balanceColor}}
                    />}
                    description={description}
                />
            </Card>
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
            <Tag style={{color: balanceColor}}>{bankAccount.netBalance}</Tag>
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

    return <div className='bank-account-title' style={{color: color}}>
        {bankTitle}
        {'   '}
        <span style={{color: balanceColor}}><DollarCircleFilled /> {bankAccount.netBalance} {LocaleCurrency.getCurrency(currency)}</span>
    </div>
}

const mapStateToProps = (state: IState) => ({
    transaction: state.transaction.transaction,
    currency: state.myself.currency
});

export default connect(mapStateToProps, {updateTransactionBankAccount})(
    BankAccountElem
);
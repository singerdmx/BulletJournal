import {BankAccount, BankAccountType} from "../../features/transactions/interface";
import {
    BankOutlined,
    CreditCardOutlined, DeleteOutlined,
    DollarCircleOutlined, EditOutlined, FileSearchOutlined,
} from "@ant-design/icons";
import React from "react";
import {stringToRGB} from "../../utils/Util";
import {Card, Statistic, Tooltip} from "antd";
import './bank.styles.less';

const {Meta} = Card;

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
            return 'https://user-images.githubusercontent.com/122956/107489631-b3e15c00-6b3d-11eb-968a-2844d781d39c.png';
        default:
            throw Error(`Invalid BankAccountType ${type}`);
    }
}

type BankAccountProps = {
    bankAccount: BankAccount;
}

const BankAccountElem: React.FC<BankAccountProps> = (
    {
        bankAccount
    }) => {
    const color = stringToRGB(bankAccount.name);
    const image = getBankAccountTypeImage(bankAccount.accountType);
    const balanceColor = bankAccount.netBalance >= 0 ? '#3f8600' : '#cf1322';
    let description = bankAccount.accountNumber ? bankAccount.accountNumber + ' ' : '';
    if (bankAccount.description) {
        description += bankAccount.description;
    }
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
                    <FileSearchOutlined key="View Transactions" title='View Transactions'/>
                </Tooltip>,
                <Tooltip title='Edit'>
                    <EditOutlined key='Edit' title='Edit' />
                </Tooltip>,
                <Tooltip title='Delete'>
                    <DeleteOutlined key='Delete' title='Delete' />
                </Tooltip>
            ]}
        >
            <Meta
                style={{height: 65}}
                title={<Statistic
                    value={bankAccount.netBalance}
                    precision={2}
                    valueStyle={{ color: balanceColor}}
                />}
                description={description}
            />
        </Card>
    </div>
}

export default BankAccountElem;
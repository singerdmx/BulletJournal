import {BankAccount, BankAccountType} from "../../features/transactions/interface";
import {BankOutlined, CreditCardOutlined, DollarCircleOutlined} from "@ant-design/icons";
import React from "react";
import {stringToRGB} from "../../utils/Util";

const getBankAccountTypeIcon = (type: BankAccountType) => {
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
}

const BankAccountElem: React.FC<BankAccountProps> = (
    {
        bankAccount
    }) => {
    const color = stringToRGB(bankAccount.name);
    const icon = getBankAccountTypeIcon(bankAccount.accountType);
    return <div></div>
}

export default BankAccountElem;
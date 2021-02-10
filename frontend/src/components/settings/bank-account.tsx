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
    const icon = getBankAccountTypeIcon(bankAccount.accountType);
    const image = getBankAccountTypeImage(bankAccount.accountType);
    return <div></div>
}

export default BankAccountElem;
import React, {useEffect, useState} from 'react';
import './bank-account.styles.less';
import {IState} from "../../store";
import {connect} from "react-redux";
import {getBankAccounts} from "../../features/myself/actions";
import {BankAccount} from "../../features/transactions/interface";
import {useParams} from "react-router-dom";
import BankAccountElem from "../../components/settings/bank-account";

type BankAccountProps = {
    getBankAccounts: () => void;
    currency: string;
    bankAccounts: BankAccount[];
}

const BankAccountPage: React.FC<BankAccountProps> = (
    {
        bankAccounts,
        getBankAccounts
    }) => {
    const { bankAccountId } = useParams();
    const [account, setAccount] = useState<BankAccount | undefined>(undefined);

    useEffect(() => {
        getBankAccounts();
    }, []);

    useEffect(() => {
        setAccount(bankAccounts.filter(b => b.id.toString() === bankAccountId)[0]);
    }, [bankAccounts]);

    useEffect(() => {
        if (account) {
            document.title = account.name;
        }
    }, [account]);

    return <div className='bank-account-page'>
        {account && <BankAccountElem bankAccount={account} mode='title'/>}
    </div>
};

const mapStateToProps = (state: IState) => ({
    bankAccounts: state.myself.bankAccounts,
});

export default connect(mapStateToProps, {getBankAccounts})(BankAccountPage);

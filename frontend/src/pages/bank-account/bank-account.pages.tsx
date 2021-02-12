import React, {useEffect, useState} from 'react';
import './bank-account.styles.less';
import {IState} from "../../store";
import {connect} from "react-redux";
import {getBankAccounts} from "../../features/myself/actions";
import {BankAccount, Transaction} from "../../features/transactions/interface";
import {useParams} from "react-router-dom";
import BankAccountElem from "../../components/settings/bank-account";
import {BackTop, Empty} from "antd";
import {Button as FloatButton, Container, darkColors, lightColors} from "react-floating-action-button";
import {CalculatorOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";

type BankAccountProps = {
    getBankAccounts: () => void;
    bankAccounts: BankAccount[];
    transactions: Transaction[];
}

const BankAccountPage: React.FC<BankAccountProps> = (
    {
        bankAccounts,
        getBankAccounts,
        transactions
    }) => {
    const {bankAccountId} = useParams();
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

    const getList = () => {
        if (transactions.length === 0) {
            return <Empty/>
        }

        return <div></div>
    }

    return <div className='bank-account-page'>
        <BackTop/>
        {account && <BankAccountElem bankAccount={account} mode='title'/>}
        {getList()}
        <Container>
            <FloatButton
                tooltip="Delete Account"
                styles={{backgroundColor: darkColors.grey, color: lightColors.white, fontSize: '25px'}}
            >
                <DeleteOutlined />
            </FloatButton>
            <FloatButton
                tooltip="Edit Account Info"
                styles={{backgroundColor: darkColors.grey, color: lightColors.white, fontSize: '25px'}}
            >
                <EditOutlined />
            </FloatButton>
            <FloatButton
                tooltip="Change Account Balance"
                styles={{backgroundColor: darkColors.grey, color: lightColors.white, fontSize: '25px'}}
            >
                <CalculatorOutlined />
            </FloatButton>
        </Container>
    </div>
};

const mapStateToProps = (state: IState) => ({
    bankAccounts: state.myself.bankAccounts,
    transactions: state.transaction.bankAccountTransactions
});

export default connect(mapStateToProps, {getBankAccounts})(BankAccountPage);

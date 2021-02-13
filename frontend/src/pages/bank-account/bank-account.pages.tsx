import React, {useEffect, useState} from 'react';
import './bank-account.styles.less';
import {IState} from "../../store";
import {connect} from "react-redux";
import {getBankAccounts} from "../../features/myself/actions";
import {BankAccount, Transaction} from "../../features/transactions/interface";
import {useHistory, useParams} from "react-router-dom";
import BankAccountElem from "../../components/settings/bank-account";
import {BackTop, Button, DatePicker, Empty, InputNumber, Popover} from "antd";
import {Button as FloatButton, Container, darkColors, lightColors} from "react-floating-action-button";
import {BankOutlined, CalculatorOutlined, DeleteOutlined, EditOutlined, SaveOutlined} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import {changeAccountBalance, getBankAccountTransactions} from "../../features/transactions/actions";
import moment, {Moment} from "moment";
import {dateFormat} from "../../features/myBuJo/constants";
const { RangePicker } = DatePicker;

type BankAccountProps = {
    getBankAccounts: () => void;
    bankAccounts: BankAccount[];
    transactions: Transaction[];
    getBankAccountTransactions: (bankAccountId: number, startDate: string, endDate: string) => void;
    changeAccountBalance: (bankAccount: BankAccount, balance: number, description: string, onSuccess: Function) => void;
}

const BankAccountPage: React.FC<BankAccountProps> = (
    {
        bankAccounts,
        getBankAccounts,
        changeAccountBalance,
        transactions,
        getBankAccountTransactions
    }) => {
    const history = useHistory();
    const {bankAccountId} = useParams();
    const [account, setAccount] = useState<BankAccount | undefined>(undefined);
    const [balance, setBalance] = useState(0);
    const [memo, setMemo] = useState('');
    const [startDate, setStartDate] = useState(moment().startOf('month'));
    const [endDate, setEndDate] = useState(moment().endOf('month'));

    useEffect(() => {
        getBankAccounts();
    }, []);

    useEffect(() => {
        setAccount(bankAccounts.filter(b => b.id.toString() === bankAccountId)[0]);
    }, [bankAccounts]);

    useEffect(() => {
        if (account) {
            document.title = account.name;
            setBalance(account.netBalance);
        }
    }, [account]);

    useEffect(() => {
        if (account) {
            getBankAccountTransactions(account.id, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
        }
    }, [startDate, endDate]);

    const getList = () => {
        if (transactions.length === 0) {
            return <Empty/>
        }

        return <div></div>
    }

    const onBalanceChange = (value: number | undefined) => {
        if (value) {
            setBalance(value);
        }
    }

    const onMemoChange = (value: string) => {
        setMemo(value);
    }

    const getEnterBankBalanceDialog = () => {
        return <div>
            <div>
                <InputNumber
                    style={{width: '250px'}}
                    value={balance}
                    formatter={value => `$ ${value}`}
                    parser={value => value ? value.replace(/\$\s?|(,*)/g, '') : 0}
                    onChange={onBalanceChange}
                />
            </div>
            <div className='change-balance-memo'>
                <TextArea rows={2} placeholder='Memo' value={memo} onChange={(e) => onMemoChange(e.target.value)}/>
            </div>
            <div className='change-balance-button'>
                <Button type="primary" shape="round" icon={<SaveOutlined/>} onClick={() => {
                    if (account) {
                        changeAccountBalance(account, balance, memo, () => {
                            if (account) {
                                getBankAccountTransactions(account.id, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
                            }
                        });
                    }
                }}>
                    Change Balance
                </Button>
            </div>
        </div>
    }

    const onTimeRangeChange = (value: any, formatString: [string, string]) => {
        const s : Moment = value[0];
        const e : Moment = value[1];
        setStartDate(s);
        setEndDate(e);
    }

    return <div className='bank-account-page'>
        <BackTop/>
        <div className='bank-account-info'>
            {account && <BankAccountElem bankAccount={account} mode='title'/>}
        </div>
        <div className='bank-account-time-range'>
            <RangePicker
                ranges={{
                    Today: [moment(), moment()],
                    'This Week': [
                        moment().startOf('week'),
                        moment().endOf('week'),
                    ],
                    'This Month': [
                        moment().startOf('month'),
                        moment().endOf('month'),
                    ],
                }}
                allowClear={false}
                format={dateFormat}
                value={[startDate, endDate]}
                placeholder={['Start Date', 'End Date']}
                onChange={onTimeRangeChange}
            />
        </div>
        <div>
            {getList()}
        </div>
        <Container>
            <FloatButton
                tooltip="Bank Accounts"
                styles={{backgroundColor: darkColors.grey, color: lightColors.white, fontSize: '25px'}}
            >
                <BankOutlined onClick={() => history.push('/bank')}/>
            </FloatButton>
            <FloatButton
                tooltip="Delete Account"
                styles={{backgroundColor: darkColors.grey, color: lightColors.white, fontSize: '25px'}}
            >
                <DeleteOutlined/>
            </FloatButton>
            <FloatButton
                tooltip="Edit Account Info"
                styles={{backgroundColor: darkColors.grey, color: lightColors.white, fontSize: '25px'}}
            >
                <EditOutlined/>
            </FloatButton>
            <Popover placement="leftTop" title='Enter Account Balance' content={getEnterBankBalanceDialog()}
                     trigger="click">
                <FloatButton
                    tooltip="Change Account Balance"
                    styles={{backgroundColor: darkColors.grey, color: lightColors.white, fontSize: '25px'}}
                >
                    <CalculatorOutlined/>
                </FloatButton>
            </Popover>
        </Container>
    </div>
};

const mapStateToProps = (state: IState) => ({
    bankAccounts: state.myself.bankAccounts,
    transactions: state.transaction.bankAccountTransactions
});

export default connect(mapStateToProps, {
    getBankAccounts,
    changeAccountBalance,
    getBankAccountTransactions
})(BankAccountPage);

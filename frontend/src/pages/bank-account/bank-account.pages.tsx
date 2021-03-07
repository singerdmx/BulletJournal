import React, {useEffect, useState} from 'react';
import './bank-account.styles.less';
import {IState} from "../../store";
import {connect} from "react-redux";
import {deleteBankAccount, getBankAccounts} from "../../features/myself/actions";
import {BankAccount, TransactionView} from "../../features/transactions/interface";
import {useHistory, useParams} from "react-router-dom";
import BankAccountElem from "../../components/settings/bank-account";
import {BackTop, Button, DatePicker, Empty, InputNumber, List, Popover, Switch, Tabs, Select} from "antd";
import {Button as FloatButton, Container, darkColors, lightColors} from "react-floating-action-button";
import {
    BankOutlined,
    CalculatorOutlined,
    DeleteOutlined,
    SaveOutlined,
    FilterOutlined,
    SortAscendingOutlined,
    CheckOutlined, CloseOutlined
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import {changeAccountBalance, getBankAccountTransactions} from "../../features/transactions/actions";
import moment, {Moment} from "moment";
import {dateFormat} from "../../features/myBuJo/constants";
import TransactionItem from '../../components/project-item/transaction-item.component';
import EditBankAccount from '../../components/modals/edit-bank.component';

const {RangePicker} = DatePicker;

type BankAccountProps = {
    getBankAccounts: () => void;
    bankAccounts: BankAccount[];
    transactions: TransactionView[];
    getBankAccountTransactions: (bankAccountId: number, startDate: string, endDate: string) => void;
    changeAccountBalance: (bankAccount: BankAccount, balance: number, description: string, onSuccess: Function) => void;
    deleteBankAccount: (id: number) => void;
}

const BankAccountPage: React.FC<BankAccountProps> = (
    {
        bankAccounts,
        getBankAccounts,
        changeAccountBalance,
        transactions,
        getBankAccountTransactions,
        deleteBankAccount,
    }) => {
    const history = useHistory();
    const {bankAccountId} = useParams();
    const [account, setAccount] = useState<BankAccount | undefined>(undefined);
    const [balance, setBalance] = useState(0);
    const [memo, setMemo] = useState('');
    const [startDate, setStartDate] = useState(moment().startOf('month'));
    const [endDate, setEndDate] = useState(moment().endOf('month'));
    const [typesFilter, setTypesFilter] = useState([0, 1]);
    const [sortMethod, setSortMethod] = useState('timeAscending');
    const [transactionsOnFilterAndSort, setTransactionsOnFilterAndSort] = useState(transactions);

    useEffect(() => {
        getBankAccounts();
        if (bankAccountId) {
            getBankAccountTransactions(parseInt(bankAccountId), startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
        }
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

    useEffect(() => {
        setTransactionsOnFilterAndSort(transactions);
        setTypesFilter([0, 1]);
        setSortMethod('timeAscending');
    }, [transactions]);

    const getList = () => {
        if (transactions.length === 0) {
            return <Empty/>
        }

        return (<List className='transaction-list'>
            {transactionsOnFilterAndSort.map((item) => (
                <List.Item key={`${item.id} + ' ' + ${item.date}`} className='transaction-list-item'>
                    <TransactionItem
                        transaction={item}
                        inProject={item.shared}
                        showModal={() => {
                        }}
                        onDeleteSuccess={() => {
                            if (account) {
                                getBankAccountTransactions(account.id, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
                                getBankAccounts();
                            }
                        }}
                    />
                </List.Item>
            ))}
        </List>);
    }

    const onBalanceChange = (value: number | undefined) => {
        if (value) {
            setBalance(value);
        }
    }

    const onMemoChange = (value: string) => {
        setMemo(value);
    }

    const {TabPane} = Tabs;
    const { Option } = Select;

    const sortTransactionByTimeAscending = (a: TransactionView, b: TransactionView) => {
        let timeA;
        let timeB;
        if (a.id < 0 && a.createdAt) {
            timeA = a.createdAt;
        } else {
            timeA = a.paymentTime;
        }

        if (b.id < 0 && b.createdAt) {
            timeB = b.createdAt;
        } else {
            timeB = b.paymentTime;
        }

        if (timeA != undefined && timeB != undefined) {
            if (timeA < timeB) {
                return -1;
            }
            if (timeA > timeB) {
                return 1;
            }
        }
        return 0;
    }

    function onSortChange(sortMethod: string) {
        setSortMethod(sortMethod);
        const tmp = [...transactionsOnFilterAndSort];

        if (sortMethod === "amountAscending") {
            tmp.sort((a, b) => a.amount - b.amount);
        } else if (sortMethod === "amountDescending") {
            tmp.sort((a, b) => b.amount - a.amount);
        } else {
            tmp.sort(sortTransactionByTimeAscending);
            if (sortMethod === "timeDescending") {
                tmp.reverse();
            }
        }

        setTransactionsOnFilterAndSort(tmp);
    }


    function onFilterChange(checked: boolean, t: number) {
        let arr = [...typesFilter]
        if (checked) {
            arr.push(t);
            console.log(arr)
            setTypesFilter(arr);
        } else {
            arr = arr.filter(e => e !== t);
            setTypesFilter(arr);
        }
        const tmp: TransactionView[] = [];
        transactions.forEach(transaction => {
            if (arr.includes(transaction.transactionType)) {
                tmp.push(transaction);
            }
        });
        setTransactionsOnFilterAndSort(tmp);
    }

    const getFilterAndSorter = () => {
        return <Tabs defaultActiveKey="1">
            <TabPane
                tab={<span><FilterOutlined/>Filter</span>}
                key="1"
            >
                <div>
                    <Switch size="small"
                            checkedChildren={<CheckOutlined/>}
                            unCheckedChildren={<CloseOutlined/>}
                            checked={typesFilter.includes(0)}
                            onChange={(checked) => onFilterChange(checked, 0)}/>
                    <span>  Income</span>
                </div>
                <div>
                    <Switch size="small"
                            checkedChildren={<CheckOutlined/>}
                            unCheckedChildren={<CloseOutlined/>}
                            checked={typesFilter.includes(1)}
                            onChange={(checked) => onFilterChange(checked, 1)}/>
                    <span>  Expense</span>
                </div>
            </TabPane>
            <TabPane
                tab={<span><SortAscendingOutlined/>Sort</span>}
                key="2"
            >
                <span>Sort by  </span>
                <Select value={sortMethod} style={{ width: 180 }} onChange={onSortChange}>
                    <Option value="timeAscending">Time: Oldest to Newest</Option>
                    <Option value="timeDescending">Time: Newest to Oldest</Option>
                    <Option value="amountAscending">Amount: Low to High</Option>
                    <Option value="amountDescending">Amount: High to Low</Option>
                </Select>
            </TabPane>
        </Tabs>
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
        const s: Moment = value[0];
        const e: Moment = value[1];
        setStartDate(s);
        setEndDate(e);
    }

    const handleDelete = (id: number | undefined) => () => {
        if (id) {
            deleteBankAccount(id);
            history.push('/bank');
        }
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
                onClick={handleDelete(account?.id)}
            >
                <DeleteOutlined/>
            </FloatButton>
            <EditBankAccount bankAccount={account} mode='float'
                             onChangeBalanceSuccess={() => {
                                 if (account) {
                                     getBankAccountTransactions(account.id, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
                                 }
                             }}/>
            <Popover placement="leftTop" title='Filter/Sort' content={getFilterAndSorter()}
                     trigger="click">
                <FloatButton
                    tooltip="Filter/Sort"
                    styles={{backgroundColor: darkColors.grey, color: lightColors.white, fontSize: '25px'}}
                >
                    <FilterOutlined/>
                </FloatButton>
            </Popover>
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
    getBankAccountTransactions,
    deleteBankAccount
})(BankAccountPage);

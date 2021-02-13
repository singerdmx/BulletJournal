create index if not exists transactions_bank_account_index
    on transactions (bank_account);

create index if not exists bank_account_transactions_bank_account_index
    on bank_account_transactions (bank_account);

create index if not exists bank_account_transactions_created_at_index
    on bank_account_transactions (created_at);
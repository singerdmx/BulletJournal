alter table bank_accounts alter column account_number type varchar(50) using account_number::varchar(10);

INSERT INTO public.bank_accounts (id, owner, name, account_number, description, account_type, created_at, updated_at,
                                  net_balance)
VALUES (1, 'BulletJournal', 'Chase', '1129', null, 'CHECKING_ACCOUNT', '2021-02-10 01:23:14.000000',
        '2021-02-10 01:23:17.000000', 1123.82),
       (2, 'BulletJournal', 'Discover', '0986', 'Discover Credit Card', 'CREDIT_CARD', '2021-02-01 01:23:14.000000',
        '2021-02-01 01:23:17.000000', -122),
       (3, 'BulletJournal', 'BOA', '2126', 'Bank of America', 'SAVING_ACCOUNT', '2021-02-02 01:23:14.000000',
        '2021-02-07 01:23:17.000000', 5123.0),
       (4, 'BulletJournal', 'Citi Double Cash', '0120', null, 'CREDIT_CARD', '2021-02-10 01:23:14.000000',
        '2021-02-10 01:23:17.000000', -123.02),
       (5, 'BulletJournal', 'Amex', '0129', null, 'CREDIT_CARD', '2021-02-01 01:23:14.000000',
        '2021-02-01 01:23:17.000000', -13.89),
       (6, 'BulletJournal', 'Capital One', null, null, 'CREDIT_CARD', '2021-02-01 01:23:14.000000',
        '2021-02-01 01:23:17.000000', -138.9);
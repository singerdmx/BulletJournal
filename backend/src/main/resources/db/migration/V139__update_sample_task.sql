UPDATE template.sample_tasks
SET name = 'Opthea Ltd (OPT) goes public on 2020-10-16',
    uid  = 'INVESTMENT_IPO_RECORD_OPT',
    raw  = '{"id":"5f6dc0b6a442ba0001861439","date":"2020-10-16","time":"06:04:38","ticker":"OPT","exchange":"NASDAQ","name":"Opthea Ltd","open_date_verified":false,"pricing_date":"2020-10-15","currency":"USD","price_min":"","price_max":"","deal_status":"Amended","insider_lockup_days":0,"insider_lockup_date":"","offering_value":0,"offering_shares":9300000,"shares_outstanding":0,"lead_underwriters":["Citigroup","SVB Leerink"],"underwriter_quiet_expiration_date":"","notes":"","updated":1602489447}'
WHERE id = 5003;

UPDATE template.sample_tasks
SET name = 'Motion Acquisition Corp (MOTNU) goes public on 2020-10-15',
    uid  = 'INVESTMENT_IPO_RECORD_MOTNU',
    raw  = '{"id":"5f71ae99a442ba0001d995d0","date":"2020-10-15","time":"05:36:25","ticker":"MOTNU","exchange":"NASDAQ","name":"Motion Acquisition Corp","open_date_verified":false,"pricing_date":"2020-10-15","currency":"USD","price_min":"10.000","price_max":"10.000","deal_status":"Priced","insider_lockup_days":180,"insider_lockup_date":"2021-04-13","offering_value":115000000,"offering_shares":11500000,"shares_outstanding":0,"lead_underwriters":["Barclays"],"underwriter_quiet_expiration_date":"2020-11-24","notes":"","updated":1602764633}'
    WHERE id = 5002;

UPDATE template.sample_tasks
SET name = 'MINISO Group Holding Ltd (MNSO) goes public on 2020-10-15',
    uid  = 'INVESTMENT_IPO_RECORD_MNSO',
    raw  = '{"id":"5f6c58decbc475000168a1f1","date":"2020-10-15","time":"04:29:18","ticker":"MNSO","exchange":"NYSE","name":"MINISO Group Holding Ltd","open_date_verified":false,"pricing_date":"2020-10-15","currency":"USD","price_min":"20.000","price_max":"20.000","deal_status":"Priced","insider_lockup_days":180,"insider_lockup_date":"2021-04-13","offering_value":608000000,"offering_shares":30400000,"shares_outstanding":0,"lead_underwriters":["Goldman Sachs","Bank of America"],"underwriter_quiet_expiration_date":"2020-11-24","notes":"","updated":1602752287}'
    WHERE id = 5001;

UPDATE template.sample_tasks
SET name = 'Spartacus Acquisition Corporation (TMTSU) goes public on 2020-10-15',
    uid  = 'INVESTMENT_IPO_RECORD_TMTSU',
    raw  = '{"id":"5f72eef2cbc4750001acac5c","date":"2020-10-15","time":"04:23:14","ticker":"TMTSU","exchange":"NASDAQ","name":"Spartacus Acquisition Corporation","open_date_verified":false,"pricing_date":"2020-10-15","currency":"USD","price_min":"10.000","price_max":"10.000","deal_status":"Priced","insider_lockup_days":180,"insider_lockup_date":"2021-04-13","offering_value":200000000,"offering_shares":20000000,"shares_outstanding":0,"lead_underwriters":["B. Riley FBR"],"underwriter_quiet_expiration_date":"2020-11-24","notes":"","updated":1602774108}'
    WHERE id = 5000;


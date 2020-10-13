delete from template.stock_ticker_details;

alter table template.stock_ticker_details
	add expiration_time timestamp not null;
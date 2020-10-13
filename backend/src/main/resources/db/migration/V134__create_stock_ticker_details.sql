create table template.stock_ticker_details
(
	ticker varchar(200)
		constraint stock_ticker_details_pk
			primary key,
	selection_id bigint not null
		constraint stock_ticker_details_selections_id_fk
			references template.selections
				on delete cascade,
	details text not null
);
alter table template.selection_metadata_keywords owner to postgres;


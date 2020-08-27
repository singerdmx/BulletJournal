UPDATE template.choices
SET multiple = true
WHERE id = 11;

UPDATE template.choices
SET multiple = true
WHERE id = 13;

UPDATE template.choices
SET multiple = true
WHERE id = 15;

alter table template.selections alter column icon type varchar(100) using icon::varchar(100);

alter table template.selections alter column icon drop not null;

UPDATE template.selections SET icon = null;
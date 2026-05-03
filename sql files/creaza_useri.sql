CREATE USER octavian WITH ENCRYPTED PASSWORD 'octavian';
GRANT ALL PRIVILEGES ON DATABASE artizania_db TO octavian ;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO octavian;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO octavian;

CREATE USER octavian_select WITH ENCRYPTED PASSWORD 'octavian';
GRANT CONNECT ON DATABASE artizania_db TO octavian_select;
GRANT USAGE ON SCHEMA public TO octavian_select;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO octavian_select;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO octavian_select;

CREATE USER octavian_insert WITH ENCRYPTED PASSWORD 'octavian';
GRANT CONNECT ON DATABASE artizania_db TO octavian_insert;
GRANT USAGE ON SCHEMA public TO octavian_insert;
GRANT INSERT ON ALL TABLES IN SCHEMA public TO octavian_insert;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO octavian_insert;

CREATE USER octavian_update WITH ENCRYPTED PASSWORD 'octavian';
GRANT CONNECT ON DATABASE artizania_db TO octavian_update;
GRANT USAGE ON SCHEMA public TO octavian_update;
GRANT UPDATE ON ALL TABLES IN SCHEMA public TO octavian_update;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO octavian_update;

CREATE USER octavian_delete WITH ENCRYPTED PASSWORD 'octavian';
GRANT CONNECT ON DATABASE artizania_db TO octavian_delete;
GRANT USAGE ON SCHEMA public TO octavian_delete;
GRANT DELETE ON ALL TABLES IN SCHEMA public TO octavian_delete;

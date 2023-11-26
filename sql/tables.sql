CREATE TABLE inputs(
    id SERIAL PRIMARY KEY,
    box_identifier VARCHAR(255) NOT NULL UNIQUE,
    box_cost DECIMAL (10, 2),
    number_of_apples_bought INTEGER,
    apples_to_sell INTEGER,
    percentage_profit DECIMAL(5,2)
);

CREATE TABLE outputs(
    input_id SERIAL PRIMARY KEY REFERENCES inputs(id)
    cost_per_apple DECIMAL(10,2),
    cost_per_packet DECIMAL(10,2),
    no_of_packets INTEGER, 
    packet_sell_price DECIMAL(10,2)
);


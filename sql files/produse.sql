DROP TYPE IF EXISTS categ_articol;
DROP TYPE IF EXISTS tipuri_artizanat;

CREATE TYPE categ_articol AS ENUM(
    'comanda speciala',
    'cadou',
    'editie limitata',
    'pentru copii',
    'decoratiune',
    'comun'
);

CREATE TYPE tipuri_artizanat AS ENUM(
    'ceramica',
    'textile',
    'lemn',
    'bijuterii',
    'accesorii'
);

CREATE TABLE IF NOT EXISTS articole (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL,
   greutate INT NOT NULL CHECK (greutate >= 0),
   tip_articol tipuri_artizanat DEFAULT 'ceramica',
   complexitate INT NOT NULL CHECK (complexitate >= 0),
   categorie categ_articol DEFAULT 'comun',
   materiale VARCHAR[],
   este_ecologic BOOLEAN NOT NULL DEFAULT FALSE,
   imagine VARCHAR(300),
   data_adaugare TIMESTAMP DEFAULT current_timestamp
);

INSERT INTO articole
(nume, descriere, pret, greutate, complexitate, tip_articol, categorie, materiale, este_ecologic, imagine)
VALUES
('Cană pictată manual', 'Cană din ceramică pictată cu motive tradiționale.', 45.0, 300, 40, 'ceramica', 'comun', '{"ceramica","vopsea","lac"}', FALSE, 'cana-pictata.jpg'),

('Brățară împletită', 'Brățară textilă împletită manual, rezistentă și colorată.', 25.0, 50, 20, 'textile', 'comun', '{"fir_textil","noduri","margele"}', FALSE, 'bratara-impletita.jpg'),

('Cutie decorativă din lemn', 'Cutie sculptată manual, ideală pentru cadouri.', 80.0, 500, 120, 'lemn', 'cadou', '{"lemn","lac","adeziv"}', FALSE, 'cutie-lemn.jpg'),

('Tablou cu flori presate', 'Decor natural realizat din flori presate.', 60.0, 200, 55, 'accesorii', 'editie limitata', '{"flori","hartie","rama"}', TRUE, 'tablou-flori.jpg'),

('Agendă handmade', 'Agendă cu copertă din material textil și hârtie reciclată.', 35.0, 250, 30, 'textile', 'comun', '{"hartie","textil","lipici"}', TRUE, 'agenda-handmade.jpg'),

('Nimic artizanal', 'Exact ce scrie: nimic. Dar ambalat frumos.', 10.0, 0, 0, 'accesorii', 'decoratiune', '{}', FALSE, 'nimic-artizanal.jpg'),

('Ornament de Crăciun', 'Glob din lemn pictat manual.', 30.0, 80, 25, 'lemn', 'comun', '{"lemn","vopsea","snur"}', FALSE, 'glob-lemn.jpg'),

('Cercei din lut polimeric', 'Cercei modelați manual, colorați și ușori.', 40.0, 20, 35, 'bijuterii', 'comun', '{"lut","vopsea","metal"}', FALSE, 'cercei-lut.jpg'),

('Figurină textilă', 'Jucărie decorativă realizată din materiale textile.', 55.0, 150, 60, 'textile', 'pentru copii', '{"textil","umplutura","ata"}', FALSE, 'figurina-textila.jpg'),

('Figurină textilă ecologică', 'Materiale reciclate și vopsele naturale.', 65.0, 150, 55, 'textile', 'pentru copii', '{"textil_reciclat","vopsea_naturala"}', TRUE, 'figurina-eco.jpg'),

('Căsuță decorativă din lemn', 'Mini-căsuță sculptată manual.', 120.0, 450, 150, 'lemn', 'cadou', '{"lemn","vopsea","adeziv"}', FALSE, 'casuta-lemn.jpg'),

('Suport pentru lumânări', 'Suport ceramic pictat manual.', 35.0, 180, 40, 'ceramica', 'comun', '{"ceramica","vopsea","lac"}', FALSE, 'suport-lumanari.jpg'),

('Set decorativ cu flori', 'Set de mini-decoruri florale pentru birou.', 50.0, 200, 45, 'accesorii', 'comanda speciala', '{"flori_artificiale","lipici","textil"}', FALSE, 'set-flori.jpg'),

('Nasturi decorativi', 'Nasturi colorați, realizați manual.', 20.5, 100, 25, 'accesorii', 'comun', '{"rasina","pigment","lac"}', FALSE, 'nasturi.jpg'),

('Breloc din lemn', 'Breloc sculptat manual, rezistent și unic.', 15.0, 40, 15, 'lemn', 'pentru copii', '{"lemn","snur"}', FALSE, 'breloc-lemn.jpg'),

('Lumânare parfumată', 'Lumânare turnată manual, cu parfum natural.', 30.0, 250, 35, 'accesorii', 'comun', '{"ceara","fitil","ulei_esențial"}', FALSE, 'lumanare.jpg'),

('Lumânare multicoloră', 'Turnată în straturi colorate, ediție limitată.', 45.0, 300, 50, 'accesorii', 'editie limitata', '{"ceara","pigment","fitil"}', FALSE, 'lumanare-multicolora.jpg'),

('Brățară cu pandantiv', 'Brățară cu pandantiv metalic, realizată manual.', 28.0, 60, 25, 'bijuterii', 'pentru copii', '{"metal","snur","lac"}', FALSE, 'bratara-pandantiv.jpg'),

('Accesoriu generic', 'Produs artizanal care nu se încadrează în nicio categorie.', 18.0, 90, 10, 'accesorii', 'comun', '{"materiale_mixte"}', FALSE, 'accesoriu-generic.jpg'),

('Poster decorativ', 'Imagine imprimată pentru cei care nu vor obiecte fizice.', 12.0, 10, 5, 'accesorii', 'comun', '{"hartie","tus"}', FALSE, 'poster.jpg'),

('Mărgele colorate', 'Set de mărgele pentru copii.', 15.0, 150, 20, 'bijuterii', 'pentru copii', '{"plastic","pigment"}', FALSE, 'margele.jpg');

CREATE TABLE Jugador (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    passwd VARCHAR(50) NOT NULL
);

CREATE TABLE Partida (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_jugador INT NOT NULL,
    fecha_partida DATETIME NOT NULL,
    wpm INT NOT NULL,
    cpm INT NOT NULL,
    acc DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (id_jugador) REFERENCES Jugador(id)
);

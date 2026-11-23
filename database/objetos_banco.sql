USE bicicletas;

CREATE OR REPLACE VIEW vw_escolhas_detalhadas AS
SELECT
    e.id_escolha,
    e.data_escolha,
    i.id_interessado,
    i.nome_interessado,
    i.fone_interessado,
    i.altura_interessado,
    i.quadro_recomendado,
    b.id_bicicleta,
    b.quadro_bicicleta,
    b.cor_bicicleta,
    b.disponivel
FROM escolha e
INNER JOIN Interessado i ON e.id_interessado = i.id_interessado
INNER JOIN Bicicleta b ON e.id_bicicleta = b.id_bicicleta;

CREATE OR REPLACE VIEW vw_estoque_por_quadro AS
SELECT
    quadro_bicicleta AS quadro,
    COUNT(*) AS total_bicicletas,
    SUM(CASE WHEN disponivel = 1 THEN 1 ELSE 0 END) AS disponiveis,
    SUM(CASE WHEN disponivel = 0 THEN 1 ELSE 0 END) AS escolhidas
FROM Bicicleta
GROUP BY quadro_bicicleta
ORDER BY CAST(quadro_bicicleta AS UNSIGNED);

DELIMITER //

CREATE OR REPLACE TRIGGER trg_apos_inserir_escolha
AFTER INSERT ON escolha
FOR EACH ROW
BEGIN
    UPDATE Bicicleta
    SET disponivel = 0
    WHERE id_bicicleta = NEW.id_bicicleta;
END//

CREATE OR REPLACE TRIGGER trg_apos_deletar_escolha
AFTER DELETE ON escolha
FOR EACH ROW
BEGIN
    UPDATE Bicicleta
    SET disponivel = 1
    WHERE id_bicicleta = OLD.id_bicicleta;
END//

CREATE OR REPLACE PROCEDURE sp_registrar_escolha(
    IN p_id_interessado INT,
    IN p_id_bicicleta INT
)
BEGIN
    DECLARE v_altura DECIMAL(3,2);
    DECLARE v_quadro_bike INT;
    DECLARE v_disponivel TINYINT (1);
    DECLARE v_quadro_permitido INT;

    SELECT altura_interessado INTO v_altura
    FROM Interessado
    WHERE id_interessado = p_id_interessado;

    IF v_altura IS NULL THEN
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Interessado não encontrado.';
    END IF;

    SELECT CAST(quadro_bicicleta AS UNSIGNED), disponivel
    INTO v_quadro_bike, v_disponivel
    FROM Bicicleta
    WHERE id_bicicleta = p_id_bicicleta;

    IF v_quadro_bike IS NULL THEN
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Bicicleta não encontrada.';
    END IF;

    IF v_disponivel = 0 THEN
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Bicicleta não disponível.';
    END IF;

    IF v_altura >= 1.50  AND v_altura <= 1.60 THEN
        SET v_quadro_permitido = 14;
    ELSEIF v_altura > 1.60 AND v_altura <= 1.70 THEN
        SET v_quadro_permitido = 16;
    ELSEIF v_altura > 1.70 THEN
        SET v_quadro_permitido = 17;
    ELSE
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Altura do interessado fora do intervalo permitido.';
    END IF;

    IF v_quadro_bike <> v_quadro_permitido THEN
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Quadro da bicicleta não compatível com a altura do interessado.';
    END IF;

    INSERT INTO escolha (id_interessado, id_bicicleta, data_escolha, createdAt, updatedAt)
    VALUES (p_id_interessado, p_id_bicicleta, NOW(), NOW(), NOW());
END//

CREATE OR REPLACE PROCEDURE sp_listar_escolhas_por_quadro(
    IN p_quadro VARCHAR(10)
)
BEGIN
    SELECT *
    FROM vw_escolhas_detalhadas
    WHERE quadro_bicicleta = p_quadro
    ORDER BY data_escolha DESC;
END//

DELIMITER ;


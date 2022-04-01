SET
  SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

SET
  AUTOCOMMIT = 0;

START TRANSACTION;

SET
  time_zone = "+00:00";


CREATE DATABASE IF NOT EXISTS `db_inventari_tic` DEFAULT CHARACTER SET utf8 COLLATE utf8_spanish_ci;

USE `db_inventari_tic`;

CREATE TABLE IF NOT EXISTS `administrators` (
  `admin_id` INT(11) AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(300) NOT NULL,
  `password` VARCHAR(100) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_spanish_ci;

CREATE TABLE IF NOT EXISTS `location` (
  `location_id` INT(11) AUTO_INCREMENT PRIMARY KEY,
  `aula` VARCHAR(60) COLLATE utf8_spanish_ci NOT NULL,
  `observacions` VARCHAR(300) COLLATE utf8_spanish_ci NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_spanish_ci;

CREATE TABLE IF NOT EXISTS `inventory` (
  `inventory_id` INT(11) AUTO_INCREMENT PRIMARY KEY,
  `num_serie` VARCHAR(150) NOT NULL,
  `text_etiqueta` VARCHAR(150) DEFAULT NULL,
  `descripcio` VARCHAR(400) DEFAULT NULL,
  `observacions` VARCHAR(400) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type_id` INT(11) NOT NULL,
  `location_id` INT(11) NOT NULL,
  FOREIGN KEY(`location_id`) REFERENCES `location`(`location_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_spanish_ci;

CREATE TABLE IF NOT EXISTS `types` (
  `type_id` INT(11) AUTO_INCREMENT PRIMARY KEY,
  `descripcio` VARCHAR(25) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_spanish_ci;

INSERT INTO
  `types` (`type_id`, `descripcio`)
VALUES 
  (0, 'Ordinador'),
  (1, 'Monitor'),
  (2, 'Proyector'),
  (3, 'Switch'),
  (4, 'MIFI');

CREATE TABLE IF NOT EXISTS `inventory_sai` (
  `inventory_sai_id` INT(11) AUTO_INCREMENT PRIMARY KEY,
  `sai_id` VARCHAR(150) NOT NULL,
  `estat` VARCHAR(150) NOT NULL,
  `tipus` VARCHAR(150) NOT NULL,
  `cod_article` VARCHAR(150) DEFAULT NULL,
  `desc_cod_article` VARCHAR(150) DEFAULT NULL,
  `num_serie` VARCHAR(150) NOT NULL,
  `fabricant` VARCHAR(150) DEFAULT NULL,
  `model` VARCHAR(150) DEFAULT NULL,
  `espai_desti` VARCHAR(150) DEFAULT NULL,
  `desc_espai_desti` VARCHAR(150) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_spanish_ci;

DELIMITER $$

CREATE TRIGGER before_inventory_insert
BEFORE INSERT
ON inventory FOR EACH ROW
BEGIN
  DECLARE tipus_var VARCHAR(150);
  DECLARE des_article_var VARCHAR(150);
  DECLARE type_id_var INT(11);

  SELECT tipus, desc_cod_article 
  INTO
    tipus_var, des_article_var
  FROM inventory_sai
  WHERE num_serie LIKE CONCAT("%", NEW.num_serie);

  IF des_article_var IS NOT NULL THEN
    IF tipus_var = 'Monitor' THEN
      SET des_article_var = CONCAT('Monitor: ', des_article_var);
    END IF;
    SET NEW.descripcio = des_article_var;

    SELECT type_id
    INTO
      type_id_var
    FROM types
    WHERE descripcio LIKE tipus_var;

    SET NEW.type_id = type_id_var;
  END IF;
END$$

DELIMITER ;
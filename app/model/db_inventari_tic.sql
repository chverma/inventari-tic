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
  `admin_id` int(11) AUTO_INCREMENT PRIMARY KEY,
  `email` varchar(300) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_spanish_ci;

CREATE TABLE IF NOT EXISTS `location` (
  `location_id` int(11) AUTO_INCREMENT PRIMARY KEY,
  `aula` varchar(60) COLLATE utf8_spanish_ci NOT NULL,
  `observacions` varchar(300) COLLATE utf8_spanish_ci NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_spanish_ci;

CREATE TABLE IF NOT EXISTS `inventory` (
  `inventory_id` int(11) AUTO_INCREMENT PRIMARY KEY,
  `num_serie` varchar(150) NOT NULL,
  `text_etiqueta` varchar(150) DEFAULT NULL,
  `descripcio` varchar(400) DEFAULT NULL,
  `observacions` varchar(400) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type_id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  FOREIGN KEY(`location_id`) REFERENCES `location`(`location_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_spanish_ci;

CREATE TABLE IF NOT EXISTS `types` (
  `type_id` int(11) AUTO_INCREMENT PRIMARY KEY,
  `descripcio` varchar(25) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_spanish_ci;

INSERT INTO
  `types` (`type_id`, `descripcio`)
VALUES 
  (0, 'ordinador'),
  (1, 'monitor'),
  (2, 'portatil'),
  (3, 'tauleta'),
  (4, 'projector');
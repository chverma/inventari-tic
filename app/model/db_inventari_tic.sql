SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `db_inventari_tic` DEFAULT CHARACTER SET utf8 COLLATE utf8_spanish_ci;
USE `db_inventari_tic`;

CREATE TABLE IF NOT EXISTS `administrators` (
  `admin_id` int(11) NOT NULL,
  `email` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

CREATE TABLE IF NOT EXISTS `location` (
  `location_id` int(11) NOT NULL,
  `aula` varchar(60) COLLATE utf8_spanish_ci NOT NULL,
  `observacions` varchar(300) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;


CREATE TABLE IF NOT EXISTS `incidence` (
  `incidence_id` int(11) NOT NULL,
  `grup` varchar(25) NOT NULL,
  `data` datetime NOT NULL,
  `motiu` int(11) NOT NULL,
  `observacions` varchar(400) DEFAULT NULL,
  `dia_com_pares` date DEFAULT NULL,
  `comentaris` varchar(400) DEFAULT NULL,
  `prof_nom` varchar(100) NOT NULL,
  `prof_cog1` varchar(100) NOT NULL,
  `prof_cog2` varchar(100) NOT NULL,
  `al_nom` varchar(100) NOT NULL,
  `al_cog1` varchar(100) NOT NULL,
  `al_cog2` varchar(100) NOT NULL,
  `assignatura` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `email` varchar(300) NOT NULL,
  `proposal_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

CREATE TABLE IF NOT EXISTS `propostes` (
  `proposal_id` int(11) NOT NULL,
  `descripcio` varchar(300) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;


/*ALTER TABLE `administrators`
  ADD PRIMARY KEY (`admin_id`);*/

ALTER TABLE `location`
  ADD PRIMARY KEY (`location_id`);

ALTER TABLE `incidence`
  ADD PRIMARY KEY (`incidence_id`),
  ADD KEY `motiu` (`motiu`),
  ADD KEY `incidence_ibfk_2` (`proposal_id`);

ALTER TABLE `propostes`
  ADD PRIMARY KEY (`proposal_id`);


ALTER TABLE `administrators`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `location`
  MODIFY `location_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

ALTER TABLE `incidence`
  MODIFY `incidence_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

ALTER TABLE `propostes`
  MODIFY `proposal_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;


ALTER TABLE `incidence`
  ADD CONSTRAINT `incidence_ibfk_1` FOREIGN KEY (`motiu`) REFERENCES `location` (`location_id`),
  ADD CONSTRAINT `incidence_ibfk_2` FOREIGN KEY (`proposal_id`) REFERENCES `propostes` (`proposal_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

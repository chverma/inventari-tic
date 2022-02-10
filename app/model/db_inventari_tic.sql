SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `db_gestor_incidencies` DEFAULT CHARACTER SET utf8 COLLATE utf8_spanish_ci;
USE `db_gestor_incidencies`;

CREATE TABLE `administrators` (
  `admin_id` int(11) NOT NULL,
  `email` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `faltes` (
  `falta_id` int(11) NOT NULL,
  `descripcio` varchar(300) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

INSERT INTO `faltes` (`falta_id`, `descripcio`) VALUES
(0, 'Cometre actes greus d\'indisciplina, injúria i ofensa. (a, h, k)'),
(1, 'Fer una agressió física o moral greu a qualsevol membre de la comunitat educativa. (b, c, i)'),
(2, 'Realitzar assetjament escolar. (d)'),
(3, 'Suplantar la personalitat en actes de la vida docent. (e)'),
(4, 'Falsificar, deteriorar o sostraure documentació acadèmica. (f)'),
(5, 'Causar danys en materials o dependències del centre escolar. (g, o)'),
(6, 'Introduir o consumir substàncies nocives i introduir objectes perillosos. (j)'),
(7, 'Incitar o estimular a cometre una falta que afecte greument la convivència en el centre. (l)'),
(8, 'Negar-se reiteradament a complir les mesures correctores o disciplinàries. (m, n)'),
(9, 'Actes atemptatoris respecte al projecte educatiu així com al caràcter del centre. (p)');

CREATE TABLE `incidence` (
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `propostes` (
  `proposal_id` int(11) NOT NULL,
  `descripcio` varchar(300) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

INSERT INTO `propostes` (`proposal_id`, `descripcio`) VALUES
(0, '1) Realització de tasques educadores, en horari no lectiu, per un període d\'entre cinc i quinze dies lectius. (h, m, n)'),
(1, '2) Suspensió del dret a participar en les activitats extraescolars durant els trenta dies següents a la imposició de la mesura disciplinària. (h, m, n)'),
(2, '3) Canvi de grup de l\'alumne/a per un període d\'entre cinc i quinze dies lectius. (h, m, n)'),
(3, '4) Suspensió del dret d\'assistència a determinades classes per un període d\'entre sis i quinze dies lectius, efectuant els treballs encomanats per part del professorat que li imparteix docència. (h, m, n)'),
(4, '5) Suspensió del dret d\'assistència al centre educatiu durant un període comprés entre sis i trenta dies lectius.');


ALTER TABLE `administrators`
  ADD PRIMARY KEY (`admin_id`);

ALTER TABLE `faltes`
  ADD PRIMARY KEY (`falta_id`);

ALTER TABLE `incidence`
  ADD PRIMARY KEY (`incidence_id`),
  ADD KEY `motiu` (`motiu`),
  ADD KEY `incidence_ibfk_2` (`proposal_id`);

ALTER TABLE `propostes`
  ADD PRIMARY KEY (`proposal_id`);


ALTER TABLE `administrators`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `faltes`
  MODIFY `falta_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

ALTER TABLE `incidence`
  MODIFY `incidence_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

ALTER TABLE `propostes`
  MODIFY `proposal_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;


ALTER TABLE `incidence`
  ADD CONSTRAINT `incidence_ibfk_1` FOREIGN KEY (`motiu`) REFERENCES `faltes` (`falta_id`),
  ADD CONSTRAINT `incidence_ibfk_2` FOREIGN KEY (`proposal_id`) REFERENCES `propostes` (`proposal_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

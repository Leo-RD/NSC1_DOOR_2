-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mar. 16 sep. 2025 à 08:21
-- Version du serveur : 9.1.0
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `neo_door`
--

-- --------------------------------------------------------

--
-- Structure de la table `acces_log`
--

DROP TABLE IF EXISTS `acces_log`;
CREATE TABLE IF NOT EXISTS `acces_log` (
  `id_log` bigint NOT NULL AUTO_INCREMENT,
  `id_personne` int DEFAULT NULL,
  `id_porte` int DEFAULT NULL,
  `ts_event` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `evenement` enum('ACCES_AUTORISE','ACCES_REFUSE','ERREUR') COLLATE utf8mb4_general_ci NOT NULL,
  `lecteur_uid` varchar(64) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `details` json DEFAULT NULL,
  PRIMARY KEY (`id_log`),
  KEY `ix_acces_log_personne` (`id_personne`),
  KEY `ix_acces_log_porte` (`id_porte`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `acces_log`
--

INSERT INTO `acces_log` (`id_log`, `id_personne`, `id_porte`, `ts_event`, `evenement`, `lecteur_uid`, `details`) VALUES
(1, 1, 1, '2025-09-16 07:55:05', 'ACCES_AUTORISE', NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `droit_acces`
--

DROP TABLE IF EXISTS `droit_acces`;
CREATE TABLE IF NOT EXISTS `droit_acces` (
  `id_personne` int NOT NULL,
  `id_porte` int NOT NULL,
  `date_debut` datetime DEFAULT NULL,
  `date_fin` datetime DEFAULT NULL,
  `cree_par` int DEFAULT NULL,
  `raison` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_personne`,`id_porte`),
  KEY `fk_da_porte` (`id_porte`),
  KEY `fk_da_cree_par` (`cree_par`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `droit_acces`
--

INSERT INTO `droit_acces` (`id_personne`, `id_porte`, `date_debut`, `date_fin`, `cree_par`, `raison`) VALUES
(1, 1, '2025-09-16 09:52:25', NULL, 1, 'My carcosa Orthur my Finished symphony ');

-- --------------------------------------------------------

--
-- Structure de la table `eleve`
--

DROP TABLE IF EXISTS `eleve`;
CREATE TABLE IF NOT EXISTS `eleve` (
  `id_personne` int NOT NULL,
  `classe` enum('CIEL1','CIEL2','SIO1','SIO2') COLLATE utf8mb4_general_ci NOT NULL,
  `numero_etudiant` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_personne`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `eleve`
--

INSERT INTO `eleve` (`id_personne`, `classe`, `numero_etudiant`) VALUES
(1, 'CIEL1', '6512');

-- --------------------------------------------------------

--
-- Structure de la table `personne`
--

DROP TABLE IF EXISTS `personne`;
CREATE TABLE IF NOT EXISTS `personne` (
  `id_personne` int NOT NULL AUTO_INCREMENT,
  `prenom` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `nom` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `organisation` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `motif_demande` varchar(512) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date_naissance` date DEFAULT NULL,
  `telephone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `adresse` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `uid_carte` varchar(64) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `actif` tinyint(1) NOT NULL DEFAULT '1',
  `type_personne` enum('eleve','admin','personnel','visiteur','autre') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'autre',
  `date_creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_personne`),
  UNIQUE KEY `ux_personne_uid_carte` (`uid_carte`),
  UNIQUE KEY `ux_personne_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `personne`
--

INSERT INTO `personne` (`id_personne`, `prenom`, `nom`, `email`, `organisation`, `motif_demande`, `date_naissance`, `telephone`, `adresse`, `uid_carte`, `actif`, `type_personne`, `date_creation`) VALUES
(1, 'Jone', 'Doe', 'TheYellowGuy@gmail.com', 'Carcosa.org', 'Orthur Open the door Orthur ', '1965-09-01', '0700000000', '1st Carcosa ', '8108915468551322054149337294766834832114863705889099842860108035', 1, 'personnel', '2025-09-16 07:50:21');

-- --------------------------------------------------------

--
-- Structure de la table `personnel`
--

DROP TABLE IF EXISTS `personnel`;
CREATE TABLE IF NOT EXISTS `personnel` (
  `id_personne` int NOT NULL,
  `est_professeur` tinyint(1) NOT NULL DEFAULT '0',
  `matiere` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `autre_role` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_personne`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `personnel`
--

INSERT INTO `personnel` (`id_personne`, `est_professeur`, `matiere`, `autre_role`) VALUES
(1, 0, 'IDK', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `personne_role`
--

DROP TABLE IF EXISTS `personne_role`;
CREATE TABLE IF NOT EXISTS `personne_role` (
  `id_personne` int NOT NULL,
  `id_role` int NOT NULL,
  `date_debut` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  PRIMARY KEY (`id_personne`,`id_role`),
  KEY `fk_pr_role` (`id_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `personne_role`
--

INSERT INTO `personne_role` (`id_personne`, `id_role`, `date_debut`, `date_fin`) VALUES
(1, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `porte`
--

DROP TABLE IF EXISTS `porte`;
CREATE TABLE IF NOT EXISTS `porte` (
  `id_porte` int NOT NULL AUTO_INCREMENT,
  `code_porte` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `nom` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `emplacement` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `actif` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_porte`),
  UNIQUE KEY `ux_porte_code` (`code_porte`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `porte`
--

INSERT INTO `porte` (`id_porte`, `code_porte`, `nom`, `emplacement`, `description`, `actif`) VALUES
(1, '64845', 'Carcosa Door', 'Orthur\'s Head', 'Cosy and feels like home', 1);

-- --------------------------------------------------------

--
-- Structure de la table `role`
--

DROP TABLE IF EXISTS `role`;
CREATE TABLE IF NOT EXISTS `role` (
  `id_role` int NOT NULL AUTO_INCREMENT,
  `code_role` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_role`),
  UNIQUE KEY `ux_role_code` (`code_role`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `role`
--

INSERT INTO `role` (`id_role`, `code_role`, `description`) VALUES
(1, '15555', 'King ');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `acces_log`
--
ALTER TABLE `acces_log`
  ADD CONSTRAINT `fk_log_personne` FOREIGN KEY (`id_personne`) REFERENCES `personne` (`id_personne`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_log_porte` FOREIGN KEY (`id_porte`) REFERENCES `porte` (`id_porte`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `droit_acces`
--
ALTER TABLE `droit_acces`
  ADD CONSTRAINT `fk_da_cree_par` FOREIGN KEY (`cree_par`) REFERENCES `personne` (`id_personne`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_da_personne` FOREIGN KEY (`id_personne`) REFERENCES `personne` (`id_personne`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_da_porte` FOREIGN KEY (`id_porte`) REFERENCES `porte` (`id_porte`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `eleve`
--
ALTER TABLE `eleve`
  ADD CONSTRAINT `fk_eleve_personne` FOREIGN KEY (`id_personne`) REFERENCES `personne` (`id_personne`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `personnel`
--
ALTER TABLE `personnel`
  ADD CONSTRAINT `fk_personnel_personne` FOREIGN KEY (`id_personne`) REFERENCES `personne` (`id_personne`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `personne_role`
--
ALTER TABLE `personne_role`
  ADD CONSTRAINT `fk_pr_personne` FOREIGN KEY (`id_personne`) REFERENCES `personne` (`id_personne`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pr_role` FOREIGN KEY (`id_role`) REFERENCES `role` (`id_role`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

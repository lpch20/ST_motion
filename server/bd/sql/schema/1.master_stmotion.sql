-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.11 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for master_stmotion
DROP DATABASE IF EXISTS `master_stmotion`;
CREATE DATABASE IF NOT EXISTS `master_stmotion` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `master_stmotion`;

-- Dumping structure for table master_stmotion.accounts
DROP TABLE IF EXISTS `accounts`;
CREATE TABLE IF NOT EXISTS `accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `database_name` varchar(45) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `max_users` int(11) NOT NULL DEFAULT '1',
  `servicePath` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table master_stmotion.accounts: ~0 rows (approximately)
DELETE FROM `accounts`;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` (`id`, `database_name`, `name`, `max_users`, `servicePath`) VALUES
	(1, 'requiro', 'requiro', 1,'http://190.64.151.34:5003/makecall.php');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;

-- Dumping structure for table master_stmotion.menu
DROP TABLE IF EXISTS `menu`;
CREATE TABLE IF NOT EXISTS `menu` (
  `id` int(11) NOT NULL,
  `label` varchar(64) NOT NULL,
  `path` varchar(64) NOT NULL,
  `icon` varchar(64) NOT NULL,
  `position` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table master_stmotion.menu: ~11 rows (approximately)
DELETE FROM `menu`;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` (`id`, `label`, `path`, `icon`, `position`) VALUES
	(1, 'Home', '/home', 'dashboard', 1),
	(2, 'Reportes de agente', '/reportes-agentes', 'layers', 2),
	(3, 'Reportes de supervisor', '/reportes-supervisor', 'layers', 3),
	(4, 'Usuarios', '/usuarios', 'people', 4),
	(5, 'Filtro de campañas', '/filtroCampanias', 'filter_list', 5),
	(6, 'Avances de llamadas', '/reportes-supervisor/avance-llamadas', 'phone_forwarded', 6),
	(7, 'Estado de campañas', '/reportes-supervisor/estado-campanias', 'category', 7),
	(8, 'Envio de SMS', '/enviar-sms-masivos', 'category', 8),
	(9, 'Clientes', '/clientesInactivos', 'category', 9),
	(10, 'Compromisos', '/compromisos', 'category', 9),
	(11, 'Campañas', '/campanias', 'category', 9);
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;

-- Dumping structure for table master_stmotion.menu_rol
DROP TABLE IF EXISTS `menu_rol`;
CREATE TABLE IF NOT EXISTS `menu_rol` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idMenu` int(11) NOT NULL,
  `idRol` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idMenu_idRol` (`idMenu`,`idRol`),
  KEY `FK_menu_rol_rols` (`idRol`),
  CONSTRAINT `FK_menu_rol_menu` FOREIGN KEY (`idMenu`) REFERENCES `menu` (`id`),
  CONSTRAINT `FK_menu_rol_rols` FOREIGN KEY (`idRol`) REFERENCES `rols` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table master_stmotion.menu_rol: ~9 rows (approximately)
DELETE FROM `menu_rol`;
/*!40000 ALTER TABLE `menu_rol` DISABLE KEYS */;
INSERT INTO `menu_rol` (`id`, `idMenu`, `idRol`) VALUES
	(8, 1, 3),
	(9, 2, 3),
	(3, 3, 2),
	(1, 4, 1),
	(4, 5, 2),
	(5, 6, 2),
	(6, 7, 2),
	(2, 8, 1),
	(7, 9, 2);
/*!40000 ALTER TABLE `menu_rol` ENABLE KEYS */;

-- Dumping structure for table master_stmotion.resources
DROP TABLE IF EXISTS `resources`;
CREATE TABLE IF NOT EXISTS `resources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table master_stmotion.resources: ~0 rows (approximately)
DELETE FROM `resources`;
/*!40000 ALTER TABLE `resources` DISABLE KEYS */;
INSERT INTO `resources` (`id`, `name`) VALUES
	(1, 'users');
/*!40000 ALTER TABLE `resources` ENABLE KEYS */;

-- Dumping structure for table master_stmotion.rols
DROP TABLE IF EXISTS `rols`;
CREATE TABLE IF NOT EXISTS `rols` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table master_stmotion.rols: ~3 rows (approximately)
DELETE FROM `rols`;
/*!40000 ALTER TABLE `rols` DISABLE KEYS */;
INSERT INTO `rols` (`id`, `name`) VALUES
	(1, 'admin'),
	(2, 'supervisor'),
	(3, 'agent');
/*!40000 ALTER TABLE `rols` ENABLE KEYS */;

-- Dumping structure for table master_stmotion.rols_resources
DROP TABLE IF EXISTS `rols_resources`;
CREATE TABLE IF NOT EXISTS `rols_resources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rol_id` int(11) NOT NULL,
  `resource_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rol_id_resource_id` (`rol_id`,`resource_id`),
  KEY `FK_rols_resources_resources` (`resource_id`),
  KEY `FK_rols_resources_rols` (`rol_id`),
  CONSTRAINT `FK_rols_resources_resources` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`),
  CONSTRAINT `FK_rols_resources_rols` FOREIGN KEY (`rol_id`) REFERENCES `rols` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table master_stmotion.rols_resources: ~3 rows (approximately)
DELETE FROM `rols_resources`;
/*!40000 ALTER TABLE `rols_resources` DISABLE KEYS */;
INSERT INTO `rols_resources` (`id`, `rol_id`, `resource_id`) VALUES
	(1, 1, 1),
	(22, 2, 1),
	(23, 3, 1);
/*!40000 ALTER TABLE `rols_resources` ENABLE KEYS */;

-- Dumping structure for table master_stmotion.sessions
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(120) NOT NULL,
  `login_date` datetime NOT NULL,
  `user_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `token_id` varchar(300) NOT NULL,
  `database_name` varchar(50) NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_name_login_date` (`user_name`,`login_date`),
  KEY `FK_sessions_users_id` (`user_id`),
  KEY `account_id` (`account_id`),
  CONSTRAINT `FK_sessions_accounts` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`),
  CONSTRAINT `FK_sessions_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK_sessions_users_username` FOREIGN KEY (`user_name`) REFERENCES `users` (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table master_stmotion.sessions: ~0 rows (approximately)
DELETE FROM `sessions`;

-- Dumping structure for table master_stmotion.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rol_id` int(11) NOT NULL,
  `user_name` varchar(120) NOT NULL,
  `password` varchar(45) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `numberOfAttempts` int(11) NOT NULL,
  `requireNewPassword` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_name` (`user_name`),
  KEY `FK_users_rols` (`rol_id`),
  CONSTRAINT `FK_users_rols` FOREIGN KEY (`rol_id`) REFERENCES `rols` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table master_stmotion.users: ~6 rows (approximately)
DELETE FROM `users`;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `rol_id`, `user_name`, `password`, `active`, `numberOfAttempts`, `requireNewPassword`) VALUES
	(10, 3, 'requiro', '7c4a8d09ca3762af61e59520943dc26494f8941b', 1, 0, 0),
	(11, 3, 'requiro 2', '7c4a8d09ca3762af61e59520943dc26494f8941b', 1, 0, 0),
	(20, 2, 'supervisor', '7c4a8d09ca3762af61e59520943dc26494f8941b', 1, 0, 0),
	(22, 2, 'supervisor 2', '7c4a8d09ca3762af61e59520943dc26494f8941b', 1, 0, 0),
	(30, 1, 'admin', '7c4a8d09ca3762af61e59520943dc26494f8941b', 1, 0, 0),
	(33, 1, 'admin 2', '7c4a8d09ca3762af61e59520943dc26494f8941b', 1, 0, 0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

-- Dumping structure for table master_stmotion.users_accounts
DROP TABLE IF EXISTS `users_accounts`;
CREATE TABLE IF NOT EXISTS `users_accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `owner` tinyint(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id_account_id` (`user_id`,`account_id`),
  KEY `FK_users_accounts_accounts` (`account_id`),
  CONSTRAINT `FK_users_accounts_accounts` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`),
  CONSTRAINT `FK_users_accounts_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table master_stmotion.users_accounts: ~6 rows (approximately)
DELETE FROM `users_accounts`;
/*!40000 ALTER TABLE `users_accounts` DISABLE KEYS */;
INSERT INTO `users_accounts` (`id`, `user_id`, `account_id`, `owner`) VALUES
	(100, 10, 1, 1),
	(101, 11, 1, 1),
	(200, 20, 1, 1),
	(202, 22, 1, 1),
	(300, 30, 1, 1),
	(303, 33, 1, 1);
/*!40000 ALTER TABLE `users_accounts` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

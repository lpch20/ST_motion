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


-- Dumping database structure for requiro
DROP DATABASE IF EXISTS `requiro_test`;
CREATE DATABASE `requiro_test` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `requiro_test`;

-- Dumping structure for table requiro.branch_office
DROP TABLE IF EXISTS `branch_office`;
CREATE TABLE `branch_office` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `address` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table requiro.breaks
DROP TABLE IF EXISTS `breaks`;
CREATE TABLE `breaks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idTypeBreak` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `init` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_breaks_BreakType1_idx` (`idTypeBreak`),
  KEY `FK_breaks_users` (`idUser`),
  CONSTRAINT `FK_breaks_users` FOREIGN KEY (`idUser`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_breaks_BreakType1` FOREIGN KEY (`idTypeBreak`) REFERENCES `break_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table requiro.break_type
DROP TABLE IF EXISTS `break_type`;
CREATE TABLE `break_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `icon` varchar(64) NOT NULL,
  `label` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table requiro.calls
DROP TABLE IF EXISTS `calls`;
CREATE TABLE `calls` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idUser` int(11) NOT NULL,
  `idCustomer` int(11) NOT NULL,
  `tel` text NOT NULL,
  `date` datetime NOT NULL,
  `origin` varchar(45) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `url` varchar(128) DEFAULT NULL,
  `response` text,
  PRIMARY KEY (`id`),
  KEY `FK_calls_users` (`idUser`),
  KEY `FK_calls_customer` (`idCustomer`),
  CONSTRAINT `FK_calls_customer` FOREIGN KEY (`idCustomer`) REFERENCES `customer` (`id`),
  CONSTRAINT `FK_calls_users` FOREIGN KEY (`idUser`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='lista de llamadas realizadas por el agente';

-- Data exporting was unselected.
-- Dumping structure for table requiro.campaign
DROP TABLE IF EXISTS `campaign`;
CREATE TABLE `campaign` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(256) DEFAULT NULL,
  `active` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table requiro.career
DROP TABLE IF EXISTS `career`;
CREATE TABLE `career` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table requiro.city
DROP TABLE IF EXISTS `city`;
CREATE TABLE `city` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `idDepartment` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_city_departaments` (`idDepartment`),
  CONSTRAINT `FK_city_departaments` FOREIGN KEY (`idDepartment`) REFERENCES `departaments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table requiro.customer
DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `names` varchar(64) NOT NULL,
    `lastnames` varchar(64) NOT NULL,
    `email` varchar(64) DEFAULT NULL,
    `date` date NOT NULL,
    `idDepartment` int(11) NOT NULL,
    `idCity` int(11) NOT NULL,
    `address` varchar(64) DEFAULT NULL,
    `idCareer` int(11) NOT NULL,
    `ci` varchar(15) NOT NULL,
    `assignDate` date DEFAULT NULL,
    `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `ci` (`ci`),
    KEY `names` (`names`),
    KEY `lastnames` (`lastnames`),
    KEY `date` (`date`),
    KEY `FK_customer_city` (`idCity`),
    KEY `FK_customer_career` (`idCareer`),
    KEY `FK_customer_departaments` (`idDepartment`),
    CONSTRAINT `FK_customer_career` FOREIGN KEY (`idCareer`) REFERENCES `career` (`id`),
    CONSTRAINT `FK_customer_city` FOREIGN KEY (`idCity`) REFERENCES `city` (`id`),
    CONSTRAINT `FK_customer_departaments` FOREIGN KEY (`idDepartment`) REFERENCES `departaments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table requiro.customer_campaign
DROP TABLE IF EXISTS `customer_campaign`;
CREATE TABLE `customer_campaign` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `idCustomer` int(11) NOT NULL,
    `idCampaign` int(11) NOT NULL,
    `date` datetime NOT NULL,
    `idUser` int(11) NOT NULL,
    `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `customer_campaign_fk_campaign` (`idCampaign`),
    KEY `customer_campaign_fk_user` (`idUser`),
    KEY `customer_campaign_fk_customer` (`idCustomer`),
    CONSTRAINT `customer_campaign_fk_campaign` FOREIGN KEY (`idCampaign`) REFERENCES `campaign` (`id`),
    CONSTRAINT `customer_campaign_fk_customer` FOREIGN KEY (`idCustomer`) REFERENCES `customer` (`id`),
    CONSTRAINT `customer_campaign_fk_user` FOREIGN KEY (`idUser`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table requiro.customer_debt
DROP TABLE IF EXISTS `customer_debt`;
CREATE TABLE `customer_debt` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `idCustomer` int(11) NOT NULL,
    `haveCreditCard` tinyint(1) NOT NULL,
    `havePurchaseOrder` tinyint(1) NOT NULL,
    `haveAmnesty` tinyint(1) NOT NULL,
    `minimumToCharge` double NOT NULL,
    `maxToCharge` double NOT NULL,
    `amountOrderPesos` double NOT NULL,
    `amountOrderDollar` tinyint(1) NOT NULL,
    `amountAmnestyPesos` double NOT NULL,
    `amountAmnestyDollar` double NOT NULL,
    `amountCreditCardPesos` double NOT NULL,
    `amountCreditCardDollar` double NOT NULL,
    `delayCreditCard` int(11) NOT NULL,
    `delayOrder` int(11) NOT NULL,
    `delayAmnesty` int(11) NOT NULL,
    `totalFeesDelayAmnesty` int(11) NOT NULL,
    `totalFeesAmnesty` int(11) NOT NULL,
    `ci` varchar(15) NOT NULL,
    `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `ci` (`ci`),
    KEY `idCustomer` (`idCustomer`),
    KEY `maxToCharge` (`maxToCharge`),
    CONSTRAINT `FK_customer_debt_customer` FOREIGN KEY (`idCustomer`) REFERENCES `customer` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table requiro.customer_events
DROP TABLE IF EXISTS `customer_events`;
CREATE TABLE `customer_events` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `idCustomer` int(11) NOT NULL,
    `phone` varchar(20) NOT NULL,
    `dateReminder` datetime NOT NULL,
    `date` datetime NOT NULL,
    `extension` int(11) NOT NULL,
    `operario` int(11) NOT NULL,
    `message` text NOT NULL,
    `eventType` int(11) NOT NULL,
    `idUser` int(11) NOT NULL,
    `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_customerevents_customer1_idx` (`idCustomer`),
    KEY `FK_customer_events_users` (`idUser`),
    KEY `FK_customer_events_event_type` (`eventType`),
    CONSTRAINT `FK_customer_events_event_type` FOREIGN KEY (`eventType`) REFERENCES `event_type` (`id`),
    CONSTRAINT `FK_customer_events_users` FOREIGN KEY (`idUser`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_customerevents_customer1` FOREIGN KEY (`idCustomer`) REFERENCES `customer` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table requiro.customer_interactions
DROP TABLE IF EXISTS `customer_interactions`;
CREATE TABLE `customer_interactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idCustomer` int(11) NOT NULL,
  `count` int(11) NOT NULL DEFAULT '0',
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idCustomer` (`idCustomer`),
  CONSTRAINT `FK_customer_interactions_customer` FOREIGN KEY (`idCustomer`) REFERENCES `customer` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='todas las interacciones con los clientes';

-- Data exporting was unselected.
-- Dumping structure for table requiro.customer_phone
DROP TABLE IF EXISTS `customer_phone`;
CREATE TABLE `customer_phone` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `idCustomer` int(11) NOT NULL,
    `phone` varchar(15) NOT NULL,
    `position` int(11) NOT NULL,
    `active` tinyint(1) NOT NULL,
    `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `FK_customer_phone_customer` (`idCustomer`),
    CONSTRAINT `FK_customer_phone_customer` FOREIGN KEY (`idCustomer`) REFERENCES `customer` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table requiro.departaments
DROP TABLE IF EXISTS `departaments`;
CREATE TABLE `departaments` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table requiro.engagement
DROP TABLE IF EXISTS `engagement`;
CREATE TABLE `engagement` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `idEvent` int(11) NOT NULL,
    `paymentPromiseDate` datetime NOT NULL,
    `numberOfFees` int(11) NOT NULL,
    `amountFees` double NOT NULL,
    `agreedDebt` double NOT NULL,
    `initialDelivery` double NOT NULL,
    `idBranchOffice` int(11) NOT NULL,
    `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `FK_engagement_customer_events` (`idEvent`),
    KEY `FK_engagement_branch_office` (`idBranchOffice`),
    CONSTRAINT `FK_engagement_branch_office` FOREIGN KEY (`idBranchOffice`) REFERENCES `branch_office` (`id`),
    CONSTRAINT `FK_engagement_customer_events` FOREIGN KEY (`idEvent`) REFERENCES `customer_events` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table requiro.errors_backend
DROP TABLE IF EXISTS `errors_backend`;
CREATE TABLE `errors_backend` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `concept` tinytext NULL,
  `message` text NULL,
  `details` text NULL,
  `stack` mediumtext NULL,
  `clientIP` tinytext,
  `idLoggedUser` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='logeo de todos los errores del servidor';

-- Data exporting was unselected.
-- Dumping structure for table requiro.errors_frontend
CREATE TABLE `errors_frontend` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(50) NULL,
  `user` varchar(50) NULL,
  `status` varchar(50) NULL,
  `url` varchar(100) NULL,
  `message` varchar(255) NULL,
  `stack` text NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;

-- Data exporting was unselected.
-- Dumping structure for table requiro.event_type
DROP TABLE IF EXISTS `event_type`;
CREATE TABLE `event_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `icon` varchar(64) NOT NULL,
  `redirect` enum('OtherPhone','OtherCustomer') NOT NULL,
  `time` int(11) NOT NULL,
  `showMessage` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table requiro.filter_def
DROP TABLE IF EXISTS `filter_def`;
CREATE TABLE `filter_def` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `group` int(11) NOT NULL,
    `name` varchar(50) NOT NULL,
    `values` text NOT NULL,
    `order` int(11) NOT NULL,
    `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `group_name` (`group`,`name`),
    KEY `order` (`order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table requiro.filter_users
DROP TABLE IF EXISTS `filter_users`;
CREATE TABLE `filter_users` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `idUser` int(11) NOT NULL,
    `group` int(11) NOT NULL,
    `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `FK_filter_users_users` (`idUser`),
    KEY `FK_filter_users_filter_def` (`group`),
    CONSTRAINT `FK_filter_users_filter_def` FOREIGN KEY (`group`) REFERENCES `filter_def` (`group`),
    CONSTRAINT `FK_filter_users_users` FOREIGN KEY (`idUser`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table requiro.item_queue
DROP TABLE IF EXISTS `item_queue`;
CREATE TABLE `item_queue` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `idQueue` int(11) NOT NULL,
    `idCustomer` int(11) NOT NULL,
    `itemOrder` int(11) NOT NULL,
    `status` enum('withoutCalling','called','skipped') NOT NULL,
    `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_item_queue_queue1_idx` (`idQueue`),
    KEY `fk_item_queue_customer1_idx` (`idCustomer`),
    KEY `itemOrder` (`itemOrder`),
    CONSTRAINT `fk_item_queue_customer1` FOREIGN KEY (`idCustomer`) REFERENCES `customer` (`id`),
    CONSTRAINT `fk_item_queue_queue1` FOREIGN KEY (`idQueue`) REFERENCES `queue` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table requiro.phone
DROP TABLE IF EXISTS `phone`;
CREATE TABLE `phone` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` varchar(32) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table requiro.queue
DROP TABLE IF EXISTS `queue`;
CREATE TABLE `queue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table requiro.queue_user
DROP TABLE IF EXISTS `queue_user`;
CREATE TABLE `queue_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idUser` int(11) NOT NULL,
  `idQueue` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idUser` (`idUser`),
  KEY `idQueue` (`idQueue`),
  CONSTRAINT `FK_queue_user_queue` FOREIGN KEY (`idQueue`) REFERENCES `queue` (`id`),
  CONSTRAINT `FK_queue_user_users` FOREIGN KEY (`idUser`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table requiro.schedule
DROP TABLE IF EXISTS `schedule`;
CREATE TABLE `schedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idUser` int(11) NOT NULL,
  `idCustomer` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `phoneNumber` varchar(15) NOT NULL,
  `subject` text NOT NULL,
  `active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_Schedule_users1_idx` (`idUser`),
  KEY `fk_Schedule_customer1_idx` (`idCustomer`),
  CONSTRAINT `fk_Schedule_customer1` FOREIGN KEY (`idCustomer`) REFERENCES `customer` (`id`),
  CONSTRAINT `fk_Schedule_users1` FOREIGN KEY (`idUser`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table requiro.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ext` int(11) NOT NULL,
  `user_name` varchar(256) NOT NULL,
  `firstname` varchar(256) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `id_user_master` int(11) NOT NULL,
  `image_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table requiro.user_session
DROP TABLE IF EXISTS `user_session`;
CREATE TABLE `user_session` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime NOT NULL,
  `userId` int(11) NOT NULL,
  `login` tinyint(1) NOT NULL,
  `agent`  int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_user_session_users` (`userId`),
  CONSTRAINT `FK_user_session_users` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `customer_payment`;
CREATE TABLE `customer_payment` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `idCustomer` int(11) NOT NULL,
    `ci` varchar(15) NOT NULL,
    `signatureDate` date DEFAULT NULL,
    `expirationDate` date DEFAULT NULL,
    `paymentDate` date DEFAULT NULL,
    `amountOfFees` int(11) DEFAULT NULL,
    `currentFee` int(11) DEFAULT NULL,
    `amount` double DEFAULT NULL,
    `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `idCustomer_paymentDate_currentFee` (`idCustomer`,`paymentDate`,`currentFee`),
    KEY `ci` (`ci`),
    CONSTRAINT `FK_customer_payment_customer` FOREIGN KEY (`idCustomer`) REFERENCES `customer` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `errors_customer_events`;
CREATE TABLE `errors_customer_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idCustomer` TEXT NOT NULL,
  `phone` TEXT NOT NULL,
  `dateReminder` TEXT NOT NULL,
  `date` TEXT NOT NULL,
  `extension` TEXT NOT NULL,
  `operario` TEXT NOT NULL,
  `message` TEXT NOT NULL,
  `eventType` TEXT NOT NULL,
  `idUser` TEXT NOT NULL,
  `error_date` DATETIME NOT NULL,
  `error_message` TEXT NOT NULL,
  PRIMARY KEY (`id`)  
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `log_import`;
CREATE TABLE `log_import` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `entity` enum('allCustomer','customer','debt','payment','agreement','campaignAssignment') NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `event` enum('begin','end') NOT NULL,
  `isSuccess` tinyint(1) DEFAULT NULL,
  `errorMessage` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `customer_agreement`;
CREATE TABLE `customer_agreement` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `idCustomer` int(11) NOT NULL,
    `amountOfDebt` int(11) DEFAULT NULL,
    `amountOfFees` int(11) DEFAULT NULL,
    `lastFeePaid` int(11) DEFAULT NULL,  
    `amountOfFeesUnpaid` int(11) DEFAULT NULL,
    `currentFee` int(11) DEFAULT NULL,
    `firstFeeUnpaid` date DEFAULT NULL,
    `lastFeeUnpaid` date DEFAULT NULL,
    `dateSigned` date DEFAULT NULL,
    `amountSigned` float DEFAULT NULL,
    `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `FK_customer_agreement_customer` FOREIGN KEY (`idCustomer`) REFERENCES `customer` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `log_massive_update`;
CREATE TABLE `log_massive_update` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `type` varchar(25) NOT NULL,
    `idUser` int(11) DEFAULT NULL,
    `countOK` int(11) DEFAULT 0,
    `countError` int(11) DEFAULT 0,
    `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

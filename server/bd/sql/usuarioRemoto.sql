ALTER TABLE `users` 
ADD COLUMN `withoutPhone` TINYINT NULL AFTER `image_name`;

ALTER TABLE `user_session` 
ADD COLUMN `ip` VARCHAR(45) NULL AFTER `agent`;

ALTER TABLE `customer_events` 
ADD COLUMN `withoutPhone` TINYINT NULL AFTER `message`,
ADD COLUMN `idCampaign` INT NULL AFTER `idUser`,
ADD INDEX `fk_customerevents_campaign_idx` (`idCampaign` ASC);
;
ALTER TABLE `customer_events` 
ADD CONSTRAINT `fk_customerevents_campaign`
  FOREIGN KEY (`idCampaign`)
  REFERENCES `campaign` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
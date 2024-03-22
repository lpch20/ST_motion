-- ------------------
--
-- PROPOSITO: queries para llenar las campañas, deudas y colas por usuarios.
--
-- ------------------
USE `requiro_test`;

-- insertar customer_campaign para cada customer con idUser y idCampaign random
DELETE FROM customer_campaign;

INSERT INTO customer_campaign (idCustomer, idCampaign, date, idUser)
SELECT id,
		(ROUND(1+ RAND()*6))  AS idCampaign,
		NOW() AS date,
		ROUND(1+ RAND()*(10)) AS idUser
FROM customer;

-- script para insertar customer_debt
DELETE FROM customer_debt;

INSERT INTO customer_debt (idCustomer, maxToCharge, `haveCreditCard`,
																	`havePurchaseOrder`,
																	`haveAmnesty`,
																	`minimumToCharge`,
																	`amountOrderPesos`,
																	`amountOrderDollar`,
																	`amountAmnestyPesos`,
																	`amountAmnestyDollar`,
																	`amountCreditCardPesos`,
																	`amountCreditCardDollar`,
																	`delayCreditCard`,
																	`delayOrder`,
																	`delayAmnesty`,
																	`totalFeesDelayAmnesty`,
																	`totalFeesAmnesty`,
																	`ci`)
SELECT id AS idCustomer,
		(ROUND(1+ RAND()*1000000)) AS maxToCharge,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,ci
FROM customer;

-- script para insertar item_queue
DELETE FROM item_queue;

INSERT INTO item_queue (idQueue, idCustomer, itemOrder, status)
SELECT  (ROUND(1+ RAND()*11))  AS idQueue,
		id AS idCustomer,
		999 as itemOrder,
		'withoutCalling' as status
FROM customer;

-- insertar customer_phone para cada customer con phone random
DELETE FROM customer_phone;

INSERT INTO customer_phone (idCustomer, phone, position, active)
SELECT id,
		(ROUND(20000000+ RAND()*20000000))  AS phone,
		ROUND(RAND()*(5)) AS position,
		1 as active
FROM customer;

-- script para asignar customer a Montevideo
UPDATE customer
SET idDepartment = 10
WHERE MOD(id,2) = 0;

-- insertar customer_campaign para cada customer con idUser y idCampaign random
DELETE FROM calls;

INSERT INTO calls (idUser, idCustomer, tel, date)
SELECT ROUND(1 + RAND()*(10)) AS idUser,
		id,
		'21231234' as tel,
		DATE_ADD(NOW(), INTERVAL -id HOUR) AS date		
FROM customer;

INSERT INTO calls (idUser, idCustomer, tel, date)
SELECT ROUND(2 + RAND()*(2)) AS idUser,
		id,
		'21231234' as tel,
		DATE_ADD(NOW(), INTERVAL -id HOUR) AS date		
FROM customer;

-- insertar customer_phone para cada customer con phone random
DELETE FROM customer_interactions;

INSERT INTO customer_interactions (idCustomer, count, date)
SELECT id,
		(ROUND(0+ RAND()*40))  AS count,
		NOW() AS date
FROM customer;
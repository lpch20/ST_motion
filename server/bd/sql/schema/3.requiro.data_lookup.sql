-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         5.7.21-log - MySQL Community Server (GPL)
-- SO del servidor:              Win64
-- HeidiSQL Versión:             9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

USE `requiro_test`;

DELETE FROM `branch_office`;
INSERT INTO `branch_office`(`name`) VALUES ("Casa Central"),
("Colón"),
("Gral. Flores"),
("Montevideo Shopping"),
("Paso Molino"),
("Portones Shopping"),
("Centro"),
("Tres Cruces Shopping"),
("Unión"),
("Artigas"),
("Bella Unión"),
("Canelones"),
("Las Piedras"),
("La Paz"),
("Lagomar"),
("Pando"),
("Santa Lucía"),
("Cerro Largo"),
("Durazno"),
("Flores"),
("Florida"),
("Lavalleja"),
("Paysandú"),
("Paysandú Shopping"),
("Maldonado"),
("Fray Bentos"),
("Young"),
("Rocha"),
("Salto"),
("Salto Shopping"),
("Tacuarembó"),
("Mercedes"),
("San José"),
("Treinta y Tres"),
("Red Pagos");

-- Volcando datos para la tabla requiro.breaks: ~0 rows (aproximadamente)
DELETE FROM `breaks`;

-- Volcando datos para la tabla requiro.break_type: ~0 rows (aproximadamente)
DELETE FROM `break_type`;
/*!40000 ALTER TABLE `break_type` DISABLE KEYS */;
INSERT INTO `break_type` (`id`, `icon`, `label`) VALUES
	(1, '', 'Baño'),
	(2, '', 'Coaching'),
	(3, '', 'Coaching grupal'),
	(4, '', 'Coaching de calidad'),
	(5, '', 'Gestión'),
	(6, '', 'Reunión con Supervisor'),
	(7, '', 'Incidencia Técnica');
/*!40000 ALTER TABLE `break_type` ENABLE KEYS */;

-- Volcando datos para la tabla requiro.campaign: ~0 rows (aproximadamente)
DELETE FROM `campaign`;
/*!40000 ALTER TABLE `campaign` DISABLE KEYS */;
INSERT INTO `campaign` (`id`, `name`, `description`, `active`) VALUES
	(1, 'General', 'Clientes que no se han llamado nunca por Requiro (se encuentran en esta campaña cuando se recibe una asignación nueva).', 1),
	(2, 'Interesados', 'Clientes con los que se está negociando, al menos tenemos un teléfono confirmado.', 1),
	(3, 'Compromiso', 'Clientes que se comprometen a pagar un plan de pagos en una fecha específica.', 1),
	(4, 'Convenios', 'Clientes que firmaron convenio y llamamos para reclamar pago de la cuota.', 1),
	(5, 'Cancelacion', 'Clientes que ya no tienen deuda.', 1),
	(6, 'Inubicables', 'Clientes que no logramos ubicar pues no hay ningún teléfono que sirva para localizarlo.', 1),
	(7, 'A devolver', 'Clientes que no algún motivo escogemos no gestionar más.', 1);
/*!40000 ALTER TABLE `campaign` ENABLE KEYS */;

-- Volcando datos para la tabla requiro.career: ~0 rows (aproximadamente)
DELETE FROM `career`;
insert into `career` (`name`) Values ('Abogado');
insert into `career` (`name`) Values ('Administrador');
insert into `career` (`name`) Values ('Albañil');
insert into `career` (`name`) Values ('Analista Web');
insert into `career` (`name`) Values ('Antropologo');
insert into `career` (`name`) Values ('Arquitecto');
insert into `career` (`name`) Values ('Bibliotecologo');
insert into `career` (`name`) Values ('Bombero');
insert into `career` (`name`) Values ('Cantante');
insert into `career` (`name`) Values ('Carpintero');
insert into `career` (`name`) Values ('Cocinero');
insert into `career` (`name`) Values ('Comerciante');
insert into `career` (`name`) Values ('Compositor');
insert into `career` (`name`) Values ('Contador');
insert into `career` (`name`) Values ('Decorador');
insert into `career` (`name`) Values ('Dentista ');
insert into `career` (`name`) Values ('Deportista');
insert into `career` (`name`) Values ('Desempleado');
insert into `career` (`name`) Values ('Diseñador');
insert into `career` (`name`) Values ('Docente');
insert into `career` (`name`) Values ('Economista');
insert into `career` (`name`) Values ('Empleado Público');
insert into `career` (`name`) Values ('Enfermero');
insert into `career` (`name`) Values ('Escribano');
insert into `career` (`name`) Values ('Farmaceutico');
insert into `career` (`name`) Values ('Feriante ');
insert into `career` (`name`) Values ('Fisioterapeuta');
insert into `career` (`name`) Values ('Gerente ');
insert into `career` (`name`) Values ('Guardia de Seguridad');
insert into `career` (`name`) Values ('Herrero');
insert into `career` (`name`) Values ('Higienista Dental ');
insert into `career` (`name`) Values ('Ingeniero');
insert into `career` (`name`) Values ('Jardinero ');
insert into `career` (`name`) Values ('Juez');
insert into `career` (`name`) Values ('Locutor');
insert into `career` (`name`) Values ('Maestro ');
insert into `career` (`name`) Values ('Maquilladora');
insert into `career` (`name`) Values ('Medico');
insert into `career` (`name`) Values ('Militar');
insert into `career` (`name`) Values ('Modelo');
insert into `career` (`name`) Values ('Musico ');
insert into `career` (`name`) Values ('Nutricionista');
insert into `career` (`name`) Values ('Oftalmologo');
insert into `career` (`name`) Values ('Pediatra');
insert into `career` (`name`) Values ('Peluquera');
insert into `career` (`name`) Values ('Periodista');
insert into `career` (`name`) Values ('Pintor');
insert into `career` (`name`) Values ('Podologo');
insert into `career` (`name`) Values ('Policia');
insert into `career` (`name`) Values ('Preparador/a Física ');
insert into `career` (`name`) Values ('Procurador');
insert into `career` (`name`) Values ('Psicologo');
insert into `career` (`name`) Values ('Psiquiatra');
insert into `career` (`name`) Values ('Publicitario/a');
insert into `career` (`name`) Values ('Quimico');
insert into `career` (`name`) Values ('Relacionista Laboral ');
insert into `career` (`name`) Values ('Relacionista Publico');
insert into `career` (`name`) Values ('Secretario ');
insert into `career` (`name`) Values ('Sociologo ');
insert into `career` (`name`) Values ('Trabajador Social ');
insert into `career` (`name`) Values ('Trabajadora Domestica ');
insert into `career` (`name`) Values ('Trabajo Informal ');
insert into `career` (`name`) Values ('Transportista ');
insert into `career` (`name`) Values ('Vendedor');
insert into `career` (`name`) Values ('Veterinario');


-- Volcando datos para la tabla requiro.city: ~0 rows (aproximadamente)
DELETE FROM `city`;
/*!40000 ALTER TABLE `city` DISABLE KEYS */;
INSERT INTO `city` (`id`, `name`, `idDepartment`) VALUES
	(1, 'Artigas', 1),
	(2, 'Montevideo', 10),
	(3, 'Sauce', 2),
	(4, 'Canelones', 2),
	(5, 'Melo', 3),
	(6, 'Colonia', 4),
	(7, 'Durazno', 5),
	(8, 'Flores', 6),
	(9, 'Florida', 7),
	(10, 'Minas', 8),
	(11, 'Maldonado', 9),
	(12, 'Punta del Este', 9),
	(13, 'Piriapolis', 9),
	(14, 'Paysandu', 11),
	(15, 'Rio Negro', 12),
	(16, 'Rivera', 13),
	(17, 'Santa Rosa', 2),
	(18, 'San Jacinto', 2),
	(19, 'Pando', 2),
	(20, 'Las Piedras', 2),
	(21, 'Baltasar Brum', 1),
	(22, 'Bella Unión', 1),
	(23, 'Cuareim', 1),
	(24, 'Franquia', 1),
	(25, 'Mones Quintela', 1),
	(26, 'Sequeira', 1),
	(27, 'Tomás Gomensoro', 1),
	(28, 'Ciudad de la Costa', 2),
	(29, 'Aguas Corrientes', 2),
	(30, 'Atlántida', 2),
	(31, 'Barra de Carrasco', 2),
	(32, 'Barros Blancos', 2),
	(33, 'Cerrillos', 2),
	(34, 'Colonia Nicolich', 2),
	(35, 'El Pinar', 2),
	(36, 'Empalme Olmos', 2),
	(37, 'Estación Atlántida', 2),
	(38, 'Estación La Floresta', 2),
	(39, 'Joaquín Suárez', 2),
	(40, 'Juanicó', 2),
	(41, 'La Floresta', 2),
	(42, 'La Paz', 2),
	(43, 'Las Toscas', 2),
	(44, 'Marindia', 2),
	(45, 'Migues', 2),
	(46, 'Montes', 2),
	(47, 'Neptunia', 2),
	(48, 'Parque del Plata', 2),
	(49, 'Paso Carrasco', 2),
	(50, 'Pinamar', 2),
	(51, 'Progreso', 2),
	(52, 'Salinas', 2),
	(53, 'San Antonio', 2),
	(54, 'San Bautista', 2),
	(55, 'San Luis', 2),
	(56, 'San Ramón', 2),
	(57, 'Santa Lucía', 2),
	(58, 'Soca', 2),
	(59, 'Tala', 2),
	(60, 'Toledo', 2),
	(61, 'Villa Aeroparque', 2),
	(62, 'Villa Crespo y San Andrés', 2),
	(63, 'Villa Felicidad', 2),
	(64, 'Villa San José', 2),
	(65, 'Aiguá', 9),
	(66, 'Balneario Buenos Aires', 9),
	(67, 'Cerro Pelado', 9),
	(68, 'El Tesoro', 9),
	(69, 'Barrio Hipódromo', 9),
	(70, 'La Capuera', 9),
	(71, 'Pan de Azúcar', 9),
	(72, 'Pinares-Las Delicias', 9),
	(73, 'Playa Grande', 9),
	(74, 'San Carlos', 9),
	(75, 'San Rafael-El Placer', 9),
	(76, 'Andresito', 6),
	(77, 'Ismael Cortinas', 6),
	(78, 'Trinidad', 6),
	(79, 'Aceguá', 3),
	(80, 'Fraile Muerto', 3),
	(81, 'Isidoro Noblía', 3),
	(82, 'Río Branco', 3),
	(83, 'Tupambaé', 3),
	(84, 'Carmelo', 4),
	(85, 'Colonia del Sacramento', 4),
	(86, 'Colonia Valdense', 4),
	(87, 'Florencio Sánchez', 4),
	(88, 'Juan Lacaze', 4),
	(89, 'Nueva Helvecia', 4),
	(90, 'Nueva Palmira', 4),
	(91, 'Ombúes de Lavalle', 4),
	(92, 'Rosario', 4),
	(93, 'Tarariras', 4),
	(94, 'Blanquillo', 5),
	(95, 'Carlos Reyles', 5),
	(96, 'Centenario', 5),
	(97, 'Feliciano', 5),
	(98, 'La Paloma', 5),
	(99, 'Santa Bernardina', 5),
	(100, 'Sarandí del Yí', 5),
	(101, '25 de Agosto', 7),
	(102, '25 de Mayo', 7),
	(103, 'Alejandro Gallinal (o Cerro Colorado)', 7),
	(104, 'Cardal', 7),
	(105, 'Casupá', 7),
	(106, 'Fray Marcos', 7),
	(107, 'Nico Pérez', 7),
	(108, 'Sarandí Grande', 7),
	(109, 'José Batlle y Ordóñez', 8),
	(110, 'José Pedro Varela', 8),
	(111, 'Mariscala', 8),
	(112, 'Solís de Mataojo', 8),
	(113, 'Aguada', 10),
	(114, 'Aires Puros', 10),
	(115, 'Arroyo Seco', 10),
	(116, 'Atahualpa', 10),
	(117, 'Bañados de Carrasco', 10),
	(118, 'Barrio Sur', 10),
	(119, 'Belvedere', 10),
	(120, 'Brazo Oriental', 10),
	(121, 'Buceo', 10),
	(122, 'Capurro', 10),
	(123, 'Carrasco', 10),
	(124, 'Carrasco Norte', 10),
	(125, 'Casabó', 10),
	(126, 'Casavalle', 10),
	(127, 'Centro', 10),
	(128, 'Cerrito de la Victoria', 10),
	(129, 'Ciudad Vieja', 10),
	(130, 'Colòn', 10),
	(131, 'Conciliación', 10),
	(132, 'Cordón', 10),
	(133, 'Flor de Maroñas', 10),
	(134, 'Goes', 10),
	(135, 'Ituzaingó', 10),
	(136, 'Jacinto Vera', 10),
	(137, 'Jardines del Hipódromo', 10),
	(138, 'La Blanqueada', 10),
	(139, 'La Comercial', 10),
	(140, 'La Figurita', 10),
	(141, 'La Teja', 10),
	(142, 'Larrañaga', 10),
	(143, 'Las Acacias', 10),
	(144, 'Las Canteras', 10),
	(145, 'Lezica', 10),
	(146, 'Malvín', 10),
	(147, 'Malvín Norte', 10),
	(148, 'Manga', 10),
	(149, 'Maroñas', 10),
	(150, 'Mercado Modelo', 10),
	(151, 'Nuevo París', 10),
	(152, 'Pajas Blancas', 10),
	(153, 'Palermo', 10),
	(154, 'Parque Batlle', 10),
	(155, 'Parque Rodó', 10),
	(156, 'Paso de la Arena', 10),
	(157, 'Paso de las Duranas', 10),
	(158, 'Paso Molino', 10),
	(159, 'Peñarol', 10),
	(160, 'Piedras Blancas', 10),
	(161, 'Pocitos', 10),
	(162, 'Prado', 10),
	(163, 'Punta Carretas', 10),
	(164, 'Punta de Rieles', 10),
	(165, 'Punta Gorda', 10),
	(166, 'Reducto', 10),
	(167, 'Sayago', 10),
	(168, 'Tres Cruces', 10),
	(169, 'Tres Ombúes', 10),
	(170, 'Unión', 10),
	(171, 'Villa del Cerro', 10),
	(172, 'Villa Española', 10),
	(173, 'Villa García', 10),
	(174, 'Chacras de Paysandú', 11),
	(175, 'Guichón', 11),
	(176, 'Nuevo Paysandú', 11),
	(177, 'Piedras Coloradas', 11),
	(178, 'Porvenir', 11),
	(179, 'Quebracho', 11),
	(180, 'San Félix', 11),
	(181, 'Tambores', 11),
	(182, 'Fray Bentos', 12),
	(183, 'Nuevo Berlín', 12),
	(184, 'San Javier', 12),
	(185, 'Young', 12),
	(186, 'Minas de Corrales', 13),
	(187, 'Tranqueras', 13),
	(188, 'Vichadero', 13),
	(189, '18 de Julio', 14),
	(190, 'Aguas Dulces', 14),
	(191, 'Arachania', 14),
	(192, 'Barra de Valizas', 14),
	(193, 'Barra del Chuy', 14),
	(194, 'Capacho', 14),
	(195, 'Castillos', 14),
	(196, 'Cebollatí', 14),
	(197, 'Chuy', 14),
	(198, 'La Aguada-Costa Azul', 14),
	(199, 'La Coronilla', 14),
	(200, 'La Pedrera', 14),
	(201, 'Lascano', 14),
	(202, 'Puimayen', 14),
	(203, 'Punta del Diablo', 14),
	(204, 'Rocha', 14),
	(205, 'San Luis al Medio', 14),
	(206, 'Velázquez', 14),
	(207, 'Belén', 15),
	(208, 'Constitución', 15),
	(209, 'Salto', 15),
	(210, 'Termas del Dayman', 15),
	(211, 'Termas del Arapey', 15),
	(212, 'Ciudad del Plata', 16),
	(213, 'Ecilda Paullier', 16),
	(214, 'Libertad', 16),
	(215, 'Puntas de Valdez', 16),
	(216, 'Rafael Perazza', 16),
	(217, 'Rodríguez', 16),
	(218, 'San José de Mayo', 16),
	(219, 'Cardona', 17),
	(220, 'Chacras de Dolores', 17),
	(221, 'Dolores', 17),
	(222, 'José Enrique Rodó', 17),
	(223, 'Mercedes', 17),
	(224, 'Palmitas', 17),
	(225, 'Villa Soriano', 17),
	(226, 'Curtina', 18),
	(227, 'Paso de los Toros', 18),
	(228, 'San Gregorio de Polanco', 18),
	(229, 'Tacuarembó', 18),
	(230, 'Villa Ansina', 18),
	(231, 'Cerro Chato', 19),
	(232, 'Ejido de Treinta y Tres', 19),
	(233, 'General Enrique Martínez (La Charqueada)', 19),
	(234, 'Santa Clara de Olimar', 19),
	(235, 'Treinta y Tres', 19),
	(236, 'Vergara', 19),
	(237, 'Villa Sara', 19);
/*!40000 ALTER TABLE `city` ENABLE KEYS */;

-- Volcando datos para la tabla requiro.customer: ~0 rows (aproximadamente)
DELETE FROM `customer`;

-- Volcando datos para la tabla requiro.customer_debt: ~0 rows (aproximadamente)
DELETE FROM `customer_debt`;

-- Volcando datos para la tabla requiro.customer_events: ~0 rows (aproximadamente)
DELETE FROM `customer_events`;

-- Volcando datos para la tabla requiro.customer_phone: ~0 rows (aproximadamente)
DELETE FROM `customer_phone`;

-- Volcando datos para la tabla requiro.customer_campaign: ~0 rows (aproximadamente)
DELETE FROM `customer_campaign`;

-- Volcando datos para la tabla requiro.departaments: ~0 rows (aproximadamente)
DELETE FROM `departaments`;
/*!40000 ALTER TABLE `departaments` DISABLE KEYS */;
INSERT INTO `departaments` (`id`, `name`) VALUES
	(1, 'Artigas'),
	(2, 'Canelones'),
	(3, 'Cerro Largo'),
	(4, 'Colonia'),
	(5, 'Durazno'),
	(6, 'Flores'),
	(7, 'Florida'),
	(8, 'Lavalleja'),
	(9, 'Maldonado'),
	(10, 'Montevideo'),
	(11, 'Paysandú'),
	(12, 'Río Negro'),
	(13, 'Rivera'),
	(14, 'Rocha'),
	(15, 'Salto'),
	(16, 'San José'),
	(17, 'Soriano'),
	(18, 'Tacuarembó'),
	(19, 'Treinta y Tres');
/*!40000 ALTER TABLE `departaments` ENABLE KEYS */;

-- Volcando datos para la tabla requiro.engagement: ~0 rows (aproximadamente)
DELETE FROM `engagement`;

-- Volcando datos para la tabla requiro.errors: ~0 rows (aproximadamente)
-- DELETE FROM `errors`;

-- Volcando datos para la tabla requiro.event_type: ~0 rows (aproximadamente)
DELETE FROM `event_type`;
/*!40000 ALTER TABLE `event_type` DISABLE KEYS */;
INSERT INTO `event_type` (`id`, `name`, `icon`, `redirect`, `time`) VALUES
	(2, 'Contacto Directo', '<i class=\'material-icons\'>how_to_reg</i>', 'OtherCustomer', 90),
	(3, 'Contacto con familiar', '<i class=\'material-icons\'>group</i>', 'OtherPhone', 90),
	(4, 'Contacto con terceros', '<i class=\'material-icons\'>transfer_within_a_station</i>', 'OtherPhone', 90),
	(5, 'No conoce', '<i class=\'material-icons\'>contact_support</i>', 'OtherPhone', 10),
	(6, 'Ocupado', '<i class=\'material-icons\'>call_end</i>', 'OtherPhone', 10),
	(7, 'No Contesta', '<i class=\'material-icons\'>phonelink_erase</i>', 'OtherPhone', 10),
	(8, 'Mensaje de voz', '<i class=\'material-icons\'>record_voice_over</i>', 'OtherPhone', 10),
	(9, 'Enviar carta', '<i class=\'material-icons\'>email</i>', 'OtherPhone', 10);
/*!40000 ALTER TABLE `event_type` ENABLE KEYS */;

-- Volcando datos para la tabla requiro.filter_def: ~0 rows (aproximadamente)
DELETE FROM `filter_def`;

-- Volcando datos para la tabla requiro.filter_users: ~0 rows (aproximadamente)
DELETE FROM `filter_users`;

-- Volcando datos para la tabla requiro.item_queue: ~0 rows (aproximadamente)
DELETE FROM `item_queue`;

-- Volcando datos para la tabla requiro.phone: ~0 rows (aproximadamente)
DELETE FROM `phone`;

-- Volcando datos para la tabla requiro.queue: ~0 rows (aproximadamente)
DELETE FROM `queue`;
/*!40000 ALTER TABLE `queue` DISABLE KEYS */;
INSERT INTO `queue` (`id`, `name`) VALUES
	(1, 'Bolsa 1'),
	(2, 'Bolsa 2');
/*!40000 ALTER TABLE `queue` ENABLE KEYS */;

-- Volcando datos para la tabla requiro.schedule: ~0 rows (aproximadamente)
DELETE FROM `schedule`;

-- Volcando datos para la tabla requiro.users: ~0 rows (aproximadamente)
DELETE FROM `users`;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`,`ext`, `user_name`, `firstname`, `lastname`, `id_user_master`) VALUES
	(10, 123, 'requiro', 'Agente 1', 'Requiro', 10),
	(11, 123, 'requiro2', 'Agente 2', 'Requiro', 11),
	(20, 123, 'supervisor', 'Supervisor 1', 'Requiro', 20),
	(22, 123, 'supervisor2', 'Supervisor 2', 'Requiro', 22),
	(30, 123, 'admin', 'Admin 1', 'Requiro', 30),
	(33, 123, 'admin2', 'Admin 2', 'Requiro', 33);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

-- Volcando datos para la tabla requiro.queue_user: ~0 rows (aproximadamente)
DELETE FROM `queue_user`;
/*!40000 ALTER TABLE `queue_user` DISABLE KEYS */;
INSERT INTO `queue_user` (`idUser`, `idQueue`) VALUES
	(10, 1),
	(11, 2);
/*!40000 ALTER TABLE `queue_user` ENABLE KEYS */;

-- Volcando datos para la tabla requiro.user_session: ~0 rows (aproximadamente)
DELETE FROM `user_session`;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

CREATE TABLE `salon_leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`contact` varchar(320) NOT NULL,
	`contactType` enum('phone','email') NOT NULL,
	`occupation` enum('beautician','esthetic','home_salon','other') NOT NULL,
	`status` enum('new','contacted','converted','archived') NOT NULL DEFAULT 'new',
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `salon_leads_id` PRIMARY KEY(`id`)
);

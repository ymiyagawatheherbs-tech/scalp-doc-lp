CREATE TABLE `staff_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(64) NOT NULL,
	`email` varchar(320) NOT NULL,
	`passwordHash` varchar(256) NOT NULL,
	`active` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `staff_accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `staff_accounts_email_unique` UNIQUE(`email`)
);

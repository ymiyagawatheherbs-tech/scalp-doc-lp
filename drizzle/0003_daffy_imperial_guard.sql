CREATE TABLE `certified_salons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`prefecture` varchar(16) NOT NULL,
	`city` varchar(64) NOT NULL,
	`address` text,
	`phone` varchar(32),
	`websiteUrl` text,
	`snsUrl` text,
	`description` text,
	`imageUrl` text,
	`services` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`published` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `certified_salons_id` PRIMARY KEY(`id`)
);

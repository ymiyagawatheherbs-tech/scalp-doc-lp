CREATE TABLE `reservation_blocks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`salonId` enum('hankyu','salon','both') NOT NULL,
	`blockDate` varchar(16) NOT NULL,
	`blockTime` varchar(8),
	`reason` varchar(256),
	`createdBy` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reservation_blocks_id` PRIMARY KEY(`id`)
);

CREATE TABLE `reservations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`email` varchar(320),
	`desiredDate` varchar(16) NOT NULL,
	`desiredTime` varchar(8) NOT NULL,
	`plan` varchar(32) NOT NULL,
	`message` text,
	`gender` enum('women','men') NOT NULL DEFAULT 'women',
	`status` enum('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reservations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scalp_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`url` text NOT NULL,
	`mimeType` varchar(64) NOT NULL,
	`fileSize` int,
	`originalName` varchar(256),
	`uploaderOpenId` varchar(64),
	`reservationId` int,
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scalp_images_id` PRIMARY KEY(`id`)
);

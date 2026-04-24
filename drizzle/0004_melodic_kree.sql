CREATE TABLE `before_afters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(128) NOT NULL,
	`beforeImageUrl` text NOT NULL,
	`afterImageUrl` text NOT NULL,
	`period` varchar(64),
	`gender` enum('women','men','both') NOT NULL DEFAULT 'both',
	`description` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`published` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `before_afters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(256) NOT NULL,
	`slug` varchar(256) NOT NULL,
	`thumbnailUrl` text,
	`excerpt` text,
	`content` text NOT NULL,
	`category` varchar(64),
	`tags` text,
	`authorName` varchar(64),
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `service_menus` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`category` varchar(64) NOT NULL,
	`durationMin` int,
	`price` int NOT NULL,
	`priceLabel` varchar(64),
	`description` text,
	`gender` enum('women','men','both') NOT NULL DEFAULT 'both',
	`sortOrder` int NOT NULL DEFAULT 0,
	`published` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `service_menus_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerName` varchar(64) NOT NULL,
	`customerAge` varchar(32),
	`concern` varchar(128),
	`rating` int NOT NULL DEFAULT 5,
	`content` text NOT NULL,
	`imageUrl` text,
	`gender` enum('women','men','both') NOT NULL DEFAULT 'both',
	`sortOrder` int NOT NULL DEFAULT 0,
	`published` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);

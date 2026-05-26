ALTER TABLE `salon_leads` MODIFY COLUMN `occupation` varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE `salon_leads` ADD `email` varchar(320) NOT NULL;--> statement-breakpoint
ALTER TABLE `salon_leads` ADD `occupationOther` varchar(256);--> statement-breakpoint
ALTER TABLE `salon_leads` DROP COLUMN `contact`;--> statement-breakpoint
ALTER TABLE `salon_leads` DROP COLUMN `contactType`;
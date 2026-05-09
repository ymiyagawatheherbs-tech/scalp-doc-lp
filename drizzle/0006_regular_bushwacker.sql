ALTER TABLE `salon_leads` ADD `accessToken` varchar(64);--> statement-breakpoint
ALTER TABLE `salon_leads` ADD `tokenExpiresAt` bigint;--> statement-breakpoint
ALTER TABLE `salon_leads` ADD CONSTRAINT `salon_leads_accessToken_unique` UNIQUE(`accessToken`);
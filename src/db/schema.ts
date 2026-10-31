import { pgTable, serial, varchar, text, boolean, timestamp, jsonb, integer, index } from 'drizzle-orm/pg-core';

export const articles = pgTable(
  'articles',
  {
    id: serial('id').primaryKey(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    title: varchar('title', { length: 500 }).notNull(),
    description: text('description').notNull(),
    content: text('content').notNull(),
    heroImage: text('hero_image').notNull(),
    category: varchar('category', { length: 100 }).notNull().default('panduan'),
    tags: jsonb('tags').$type<string[]>().notNull().default([]),
    author: varchar('author', { length: 255 }).notNull().default('Tim Ahli Agro Prima Greenhouse'),
    status: varchar('status', { length: 50 }).notNull().default('draft'), // 'draft', 'scheduled', 'published', 'archived'
    featured: boolean('featured').notNull().default(false),
    scheduledAt: timestamp('scheduled_at', { withTimezone: true, mode: 'date' }),
    publishedAt: timestamp('published_at', { withTimezone: true, mode: 'date' }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_articles_status_scheduled').on(table.status, table.scheduledAt),
    index('idx_articles_published_at').on(table.publishedAt),
    index('idx_articles_category').on(table.category),
  ]
);

export const media = pgTable(
  'media',
  {
    id: serial('id').primaryKey(),
    url: text('url').notNull(),
    pathname: varchar('pathname', { length: 500 }).notNull(),
    filename: varchar('filename', { length: 255 }).notNull(),
    contentType: varchar('content_type', { length: 100 }),
    size: integer('size'),
    altText: text('alt_text'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_media_created_at').on(table.createdAt),
  ]
);

export const cronLogs = pgTable(
  'cron_logs',
  {
    id: serial('id').primaryKey(),
    jobName: varchar('job_name', { length: 100 }).notNull(),
    status: varchar('status', { length: 50 }).notNull(), // 'success', 'failed'
    message: text('message'),
    articlesProcessed: integer('articles_processed').default(0),
    executedAt: timestamp('executed_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_cron_logs_executed_at').on(table.executedAt),
  ]
);

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
export type CronLog = typeof cronLogs.$inferSelect;
export type NewCronLog = typeof cronLogs.$inferInsert;

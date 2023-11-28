import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-valibot'

export const chat = pgTable('chat', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 256 }).notNull(),
  title: text('title').notNull(),
  assistantId: integer('assistant_id').references(() => assistant.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
export type Chat = typeof chat.$inferSelect // return type when queried
export type NewChat = typeof chat.$inferInsert
export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  assistantId: integer('assistant_id').references(() => assistant.id),
  size: integer('size').notNull(),
  url: text('url').notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type Documents = typeof documents.$inferSelect // return type when queried
export type NewDocuments = typeof documents.$inferInsert

export const assistant = pgTable('assistant', {
  id: serial('id').primaryKey(),
  title: text('title').unique(),
})
export type Assistant = typeof assistant.$inferSelect // return type when queried
export type NewAssistant = typeof assistant.$inferInsert
export const insertAssistantSchema = createInsertSchema(assistant)

export const message = pgTable('message', {
  id: serial('id').primaryKey(),
  chatId: integer('chat_id').references(() => chat.id),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  role: text('role', { enum: ['user', 'system', 'assistant'] }).notNull(),
})
export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 256 }).notNull().unique(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 256 })
    .notNull()
    .unique(),
  stripeSubscriptionId: varchar('stripe_subscription_id', {
    length: 256,
  }).unique(),
  stripePriceId: varchar('stripe_price_id', { length: 256 }),
  stripeCurrentPeriodEnd: timestamp('stripe_current_period_end'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
export type Message = typeof message.$inferSelect // return type when queried
export type NewMessage = typeof message.$inferInsert

import { pgTable, serial, varchar, integer, text, timestamp, index } from "drizzle-orm/pg-core"

// 船舶设计表
export const shipDesigns = pgTable(
  "ship_designs",
  {
    id: serial().primaryKey(),
    group_id: integer("group_id").notNull().unique(),
    group_name: varchar("group_name", { length: 50 }).notNull(),
    river_id: varchar("river_id", { length: 20 }).notNull(),
    material: varchar("material", { length: 100 }),
    bow_shape: varchar("bow_shape", { length: 100 }),
    bottom_shape: varchar("bottom_shape", { length: 100 }),
    propulsion: varchar("propulsion", { length: 100 }),
    cargo_info: varchar("cargo_info", { length: 100 }),
    cargo_count: integer("cargo_count").default(0),
    special_design: varchar("special_design", { length: 200 }),
    image_url: varchar("image_url", { length: 500 }),
    score: integer("score").notNull(),
    total_cost: integer("total_cost").notNull(),
    report: text("report"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("ship_designs_group_id_idx").on(table.group_id),
    index("ship_designs_created_at_idx").on(table.created_at),
  ]
)

// 类型导出
export type ShipDesign = typeof shipDesigns.$inferSelect

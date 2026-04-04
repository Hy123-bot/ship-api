"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipDesigns = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.shipDesigns = (0, pg_core_1.pgTable)("ship_designs", {
    id: (0, pg_core_1.serial)().primaryKey(),
    group_id: (0, pg_core_1.integer)("group_id").notNull().unique(),
    group_name: (0, pg_core_1.varchar)("group_name", { length: 50 }).notNull(),
    river_id: (0, pg_core_1.varchar)("river_id", { length: 20 }).notNull(),
    material: (0, pg_core_1.varchar)("material", { length: 100 }),
    bow_shape: (0, pg_core_1.varchar)("bow_shape", { length: 100 }),
    bottom_shape: (0, pg_core_1.varchar)("bottom_shape", { length: 100 }),
    propulsion: (0, pg_core_1.varchar)("propulsion", { length: 100 }),
    cargo_info: (0, pg_core_1.varchar)("cargo_info", { length: 100 }),
    cargo_count: (0, pg_core_1.integer)("cargo_count").default(0),
    special_design: (0, pg_core_1.varchar)("special_design", { length: 200 }),
    image_url: (0, pg_core_1.varchar)("image_url", { length: 500 }),
    score: (0, pg_core_1.integer)("score").notNull(),
    total_cost: (0, pg_core_1.integer)("total_cost").notNull(),
    report: (0, pg_core_1.text)("report"),
    created_at: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
    (0, pg_core_1.index)("ship_designs_group_id_idx").on(table.group_id),
    (0, pg_core_1.index)("ship_designs_created_at_idx").on(table.created_at),
]);
//# sourceMappingURL=schema.js.map
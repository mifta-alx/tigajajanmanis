import type { OutletEntity } from "./models";

export type CreateOutletDTO = Omit<
  OutletEntity,
  "id" | "is_active" | "created_at" | "updated_at"
>;

export type UpdateOutletDTO = Partial<CreateOutletDTO>;

export type Outlet = Omit<OutletEntity, "created_at" | "updated_at">;

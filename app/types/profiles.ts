import type { ProfileEntity } from "./models";

export type CreateProfileDTO = Omit<
  ProfileEntity,
  "id" | "is_active" | "created_at" | "updated_at"
>;

export type UpdateProfileDTO = Partial<CreateProfileDTO>;

export interface User extends Omit<ProfileEntity, "created_at" | "updated_at"> {
  outlet_name: string | null;
}

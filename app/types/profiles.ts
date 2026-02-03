import type { Profile } from "./models";

export type CreateProfileDTO = Omit<
  Profile,
  "id" | "is_active" | "created_at" | "updated_at"
>;

export type UpdateProfileDTO = Partial<CreateProfileDTO>;

export type User = Omit<Profile, "created_at" | "updated_at">;

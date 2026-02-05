import type { CreateOutletDTO, Outlet, UpdateOutletDTO } from "~/types/outlet";

export const useOutlet = () => {
  const supabase = useSupabaseClient();

  const createOutlet = async (payload: CreateOutletDTO) => {
    const insertData: CreateOutletDTO = {
      name: payload.name,
      address: payload.address,
    };

    const { data, error } = await supabase
      .from("outlets")
      .insert(insertData as any)
      .select()
      .single();

    if (error) throw error;
    return data as Outlet;
  };

  const updateOutlet = async (id: string, payload: UpdateOutletDTO) => {
    const updateData: UpdateOutletDTO = {
      name: payload.name,
      address: payload.address,
    };

    const { error } = await (supabase.from("outlets") as any)
      .update(updateData)
      .eq("id", id);

    if (error) throw error;
  };

  const deleteOutlet = async (id: string) => {
    const { error: dbError } = await supabase
      .from("outlets")
      .delete()
      .eq("id", id);

    if (dbError) throw dbError;
  };

  const toggleStatus = async (outletId: string, newStatus: boolean) => {
    const { error: dbError } = await (supabase.from("outlets") as any)
      .update({ is_active: newStatus })
      .eq("id", outletId);

    if (dbError) throw dbError;
  };

  const fetchOutlets = async (
    params: {
      search?: string;
      page?: number;
      limit?: number;
    } = {},
  ): Promise<{ data: Outlet[]; total: number }> => {
    const { search, page = 1, limit = 1000 } = params;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from("outlets").select(
      `
      id, 
      name,
      address, 
      is_active
    `,
      {
        count: "exact",
      },
    );

    if (search) {
      query = query.or(`name.ilike.%${search}%`);
    }
    const { data, error, count } = await query
      .order("name", { ascending: true })
      .range(from, to);

    if (error) throw error;

    return { data: data, total: count || 0 };
  };

  return {
    createOutlet,
    updateOutlet,
    deleteOutlet,
    fetchOutlets,
    toggleStatus,
  };
};

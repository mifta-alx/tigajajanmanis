import type { GeneralStatistics, MonthlyData } from "~/types/dashboard";

interface TransactionRow {
  created_at: string;
  total_profit: number;
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const useDashboard = () => {
  const supabase = useSupabaseClient();

  const getGeneralStats = async (): Promise<GeneralStatistics> => {
    const [outlets, sales, merchants, products, lastCreated] =
      await Promise.all([
        supabase.from("outlets").select("*", { count: "exact", head: true }),
        supabase
          .from("transactions")
          .select("*", { count: "exact", head: true }),
        supabase.from("merchants").select("*", { count: "exact", head: true }),
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase
          .from("transactions")
          .select("created_at")
          .order("created_at", { ascending: false })
          .limit(1)
          .single(),
      ]);

    const timeAgo = (dateString: string) => {
      if (!dateString) return "No data";
      const now = new Date();
      const past = new Date(dateString);
      const diffInMs = now.getTime() - past.getTime();

      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      const diffInMonths = Math.floor(diffInDays / 30);

      if (diffInMonths > 0)
        return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
      if (diffInDays > 0)
        return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
      return "just now";
    };

    const activity = lastCreated as any;

    return {
      totalOutlets: outlets.count || 0,
      totalSales: sales.count || 0,
      totalMerchants: merchants.count || 0,
      totalProducts: products.count || 0,
      updatedAt: activity.data ? timeAgo(activity.data.created_at) : "",
    };
  };

  const getFinanceStats = async () => {
    const now = new Date();

    // Range Minggu Lalu (Day 0 - 7)
    const lastWeekStart = new Date(
      new Date().setDate(now.getDate() - 7),
    ).toISOString();

    // Range 2 Minggu Lalu (Day 7 - 14) buat pembanding
    const twoWeeksStart = new Date(
      new Date().setDate(now.getDate() - 14),
    ).toISOString();

    const [currentData, prevData] = await Promise.all([
      supabase
        .from("transactions")
        .select(
          `
        total_price,
        total_profit
      `,
        )
        .gte("created_at", lastWeekStart),
      supabase
        .from("transactions")
        .select(
          `
        total_price,
        total_profit
      `,
        )
        .gte("created_at", twoWeeksStart)
        .lt("created_at", lastWeekStart),
    ]);

    const calculateFinances = (data: any[] | null) => {
      if (!data) return { revenue: 0, profit: 0 };

      return data.reduce(
        (acc, trx) => {
          acc.revenue += trx.total_price || 0;
          acc.profit += trx.total_profit || 0;
          return acc;
        },
        { revenue: 0, profit: 0 },
      );
    };

    const currentStats = calculateFinances(currentData.data);
    const prevStats = calculateFinances(prevData.data);

    const calcTrend = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return Math.round(((curr - prev) / prev) * 100);
    };

    return {
      revenue: {
        value: currentStats.revenue,
        trend: calcTrend(currentStats.revenue, prevStats.revenue),
      },
      profit: {
        value: currentStats.profit,
        trend: calcTrend(currentStats.profit, prevStats.profit),
      },
    };
  };

  const getTopProducts = async (outletId?: string) => {
    const now = new Date();
    // Gunakan clone date supaya tidak merusak objek date asli
    const lastWeekStart = new Date(
      new Date().setDate(now.getDate() - 7),
    ).toISOString();

    let query = supabase
      .from("transaction_items")
      .select(
        `
      quantity,
      product_id,
      products!inner ( 
        name, 
        image_url,
        merchants!inner (
          name
        )
      ),
      transactions!inner ( status, created_at, outlet_id )
    `,
      )
      .eq("transactions.status", "COMPLETED")
      .gte("transactions.created_at", lastWeekStart)
      .limit(1000);

    if (outletId) {
      query = query.eq("transactions.outlet_id", outletId);
    }

    const { data, error } = await query;
    if (error) throw error;

    const aggregated = data.reduce((acc: any, item: any) => {
      const productId = item.product_id;
      const productData = item.products;

      if (!acc[productId]) {
        acc[productId] = {
          name: productData?.name || "Unknown",
          image_url: productData?.image_url || null,
          merchant_name: productData?.merchants?.name || "No Merchant",
          total_qty: 0,
        };
      }

      acc[productId].total_qty += item.quantity || 0;
      return acc;
    }, {});

    return Object.values(aggregated)
      .sort((a: any, b: any) => b.total_qty - a.total_qty)
      .slice(0, 5);
  };

  const getMonthlyProfit = async () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString();

    const { data, error } = await supabase
      .from("transactions")
      .select("total_profit, created_at")
      .eq("status", "COMPLETED")
      .gte("created_at", startOfYear)
      .order("created_at", { ascending: true });

    if (error) throw error;

    const monthlyData: MonthlyData[] = months.map((month) => ({
      month,
      profit: 0,
    }));

    data?.forEach((trx: TransactionRow) => {
      const date = new Date(trx.created_at);
      const monthIndex = date.getMonth(); // 0 = Jan, 1 = Feb, dst.
      if (monthlyData[monthIndex]) {
        monthlyData[monthIndex].profit += Number(trx.total_profit) || 0;
      }
    });

    // Jika ingin membatasi sampai bulan berjalan saja:
    // return monthlyData.slice(0, now.getMonth() + 1);

    return monthlyData;
  };

  const getYearlySalesStats = async () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const lastYear = currentYear - 1;

    // Ambil data 2 tahun terakhir
    const { data, error } = await supabase
      .from("transactions")
      .select("created_at")
      .eq("status", "COMPLETED")
      .gte("created_at", `${lastYear}-01-01`);

    if (error) throw error;

    // Inisialisasi struktur data
    const currentYearSales = new Array(12).fill(0);
    let lastYearTotal = 0;
    let currentYearTotal = 0;

    data?.forEach((trx: TransactionRow) => {
      const date = new Date(trx.created_at);
      const year = date.getFullYear();
      const monthIndex = date.getMonth();

      if (year === currentYear) {
        currentYearSales[monthIndex]++;
        currentYearTotal++;
      } else if (year === lastYear) {
        lastYearTotal++;
      }
    });

    // Hitung tren (growth)
    const trend =
      lastYearTotal === 0
        ? currentYearTotal > 0
          ? 100
          : 0
        : Math.round(
            ((currentYearTotal - lastYearTotal) / lastYearTotal) * 100,
          );

    return {
      labels: months,
      series: currentYearSales,
      trend,
      currentYear,
      lastYear,
    };
  };

  const getDailyRevenueByOutlet = async () => {
    const now = new Date();
    // Ambil 7 hari terakhir (setengah jam terakhir hari ini ke belakang)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
      total_price,
      created_at,
      outlets!inner ( name )
    `,
      )
      .eq("status", "COMPLETED")
      .gte("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: true });

    if (error) throw error;

    // Generate label hari (Mon, Tue, dst)
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const last7DaysLabels: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(now.getDate() - (6 - i));
      const dayName = days[d.getDay()] ?? "";
      last7DaysLabels.push(dayName);
    }

    // Proses grouping data
    const outletData: Record<string, number[]> = {};

    data?.forEach((trx: any) => {
      const outletName = trx.outlets.name;
      const trxDate = new Date(trx.created_at);

      // Cari index hari (0-6) berdasarkan selisih hari dari 7 hari lalu
      const diffTime = trxDate.getTime() - sevenDaysAgo.getTime();
      const dayIndex = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (dayIndex >= 0 && dayIndex < 7) {
        if (!outletData[outletName]) {
          outletData[outletName] = new Array(7).fill(0);
        }
        const row = outletData[outletName];
        if (row && typeof row[dayIndex] === "number") {
          row[dayIndex] += Number(trx.total_price) || 0;
        }
      }
    });

    return {
      labels: last7DaysLabels,
      series: Object.entries(outletData).map(([name, data]) => ({
        name,
        data,
      })),
    };
  };

  const fetchDashboardData = async () => {
    try {
      const [
        inventory,
        finance,
        topProducts,
        monthlyProfit,
        yearlySales,
        revenueOutlet,
      ] = await Promise.all([
        getGeneralStats(),
        getFinanceStats(),
        getTopProducts(),
        getMonthlyProfit(),
        getYearlySalesStats(),
        getDailyRevenueByOutlet(),
      ]);
      return {
        inventory,
        finance,
        topProducts,
        monthlyProfit,
        yearlySales,
        revenueOutlet,
      };
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
      throw error;
    }
  };

  return {
    fetchDashboardData,
  };
};

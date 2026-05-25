import { mockAirdrops, mockTasks, mockActivity } from "./mockData";

// Demo mode: intercept API calls and return mock data when backend is unavailable
const API_TIMEOUT = 3000;

async function checkApiAvailable(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const response = await fetch("/api/health", { 
      signal: controller.signal,
      headers: { "Accept": "application/json" }
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

let _isDemoMode: boolean | null = null;

export async function isDemoMode(): Promise<boolean> {
  if (_isDemoMode !== null) return _isDemoMode;
  _isDemoMode = !(await checkApiAvailable());
  return _isDemoMode;
}

export function resetDemoMode() {
  _isDemoMode = null;
}

// Mock API responses
export const mockApi = {
  listAirdrops: async (params?: { status?: string; category?: string; chain?: string; featured?: string; search?: string }) => {
    await new Promise(r => setTimeout(r, 100)); // Simulate network delay
    
    let results = [...mockAirdrops];
    
    if (params?.status) {
      results = results.filter(a => a.status === params.status);
    }
    if (params?.category) {
      results = results.filter(a => a.category === params.category);
    }
    if (params?.chain) {
      results = results.filter(a => a.chain === params.chain);
    }
    if (params?.featured === "true") {
      results = results.filter(a => a.isFeatured);
    }
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      results = results.filter(a => 
        a.name.toLowerCase().includes(searchLower) ||
        a.description.toLowerCase().includes(searchLower)
      );
    }
    
    return results;
  },
  
  getAirdrop: async (id: number) => {
    await new Promise(r => setTimeout(r, 50));
    const airdrop = mockAirdrops.find(a => a.id === id);
    if (!airdrop) throw new Error("Airdrop not found");
    return airdrop;
  },
  
  createAirdrop: async (data: Record<string, unknown>) => {
    await new Promise(r => setTimeout(r, 100));
    const newId = Math.max(...mockAirdrops.map(a => a.id)) + 1;
    const newAirdrop = {
      id: newId,
      slug: (data.slug as string) || `airdrop-${newId}`,
      logoColor: (data.logoColor as string) || "#d95c38",
      logoInitial: (data.logoInitial as string) || ((data.name as string)?.charAt(0).toUpperCase() || "A"),
      participantsCount: 0,
      taskCount: 0,
      createdAt: new Date().toISOString(),
      ...data,
    };
    mockAirdrops.push(newAirdrop as typeof mockAirdrops[0]);
    return newAirdrop;
  },
  
  updateAirdrop: async (id: number, data: Record<string, unknown>) => {
    await new Promise(r => setTimeout(r, 100));
    const index = mockAirdrops.findIndex(a => a.id === id);
    if (index === -1) throw new Error("Airdrop not found");
    mockAirdrops[index] = { ...mockAirdrops[index], ...data } as typeof mockAirdrops[0];
    return mockAirdrops[index];
  },
  
  deleteAirdrop: async (id: number) => {
    await new Promise(r => setTimeout(r, 100));
    const index = mockAirdrops.findIndex(a => a.id === id);
    if (index !== -1) mockAirdrops.splice(index, 1);
  },
  
  listTasks: async (airdropId?: number) => {
    await new Promise(r => setTimeout(r, 50));
    if (airdropId) {
      return mockTasks.filter(t => t.airdropId === airdropId);
    }
    return mockTasks;
  },
  
  listActivity: async () => {
    await new Promise(r => setTimeout(r, 50));
    return mockActivity;
  },
};

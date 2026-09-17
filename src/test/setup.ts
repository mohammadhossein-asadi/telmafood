// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

// Mock next-themes
vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: vi.fn(),
    resolvedTheme: "light",
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock TanStack Query
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
  useInfiniteQuery: vi.fn(),
  useQueryClient: () => ({
    invalidateQueries: vi.fn(),
    removeQueries: vi.fn(),
    setQueryData: vi.fn(),
    getQueryData: vi.fn(),
  }),
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock zustand
vi.mock("zustand", () => ({
  create: vi.fn((fn) => fn(vi.fn(), vi.fn())),
}));

vi.mock("zustand/middleware", () => ({
  persist: vi.fn((fn) => fn),
}));

// Mock lucide-react icons
const mockLucideIcons = () => {
  const icons = [
    "Sun", "Moon", "Bookmark", "Search", "Clock", "Users", "ExternalLink",
    "SlidersHorizontal", "X", "ChevronDown", "ChevronUp", "ChevronLeft", "ChevronRight",
    "Filter", "Tag", "Heart", "Star", "AlertCircle", "RefreshCw", "Check", "X",
    "Loader2", "Menu", "Close", "Home", "Settings", "User", "LogOut",
  ];
  
  const mockComponents: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {};
  for (const name of icons) {
    mockComponents[name] = (props: React.SVGProps<SVGSVGElement>) => 
      React.createElement("svg", { "data-testid": `icon-${name.toLowerCase()}`, ...props });
  }

  return { ...mockComponents };
};

vi.mock("lucide-react", mockLucideIcons);

// Mock sonner
vi.mock("sonner", () => ({
  Toaster: ({ children }: { children: React.ReactNode }) => React.createElement("div", {}, children),
  toast: vi.fn(),
}));

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Suppress console errors in tests (optional)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render is no longer supported")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

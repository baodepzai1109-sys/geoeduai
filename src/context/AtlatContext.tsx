"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { notifications as defaultNotifications } from "@/data/notifications";
interface AtlatContextType {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  scrollToPage: number | null;

setScrollToPage: Dispatch<
  SetStateAction<number | null>
>;
  totalPages: number;
  setTotalPages: Dispatch<SetStateAction<number>>;

  scale: number;
  setScale: Dispatch<SetStateAction<number>>;
  bookmarks: number[];
  setBookmarks: Dispatch<SetStateAction<number[]>>;
  notes: Record<number, string>;
setNotes: Dispatch<SetStateAction<Record<number, string>>>;
  visitedPages: number[];
setVisitedPages: Dispatch<SetStateAction<number[]>>;
history: number[];
setHistory: Dispatch<SetStateAction<number[]>>;
recentPages: {
  page: number;
  time: number;
}[];

setRecentPages: Dispatch<
  SetStateAction<
    {
      page: number;
      time: number;
    }[]
  >
>;
notifications: {
  id: number;
  title: string;
  content: string;
  read: boolean;
  createdAt: number;

}[];

setNotifications: Dispatch<
  SetStateAction<
    {
      id: number;
      title: string;
      content: string;
      read: boolean;
      createdAt: number;
    }[]
  >
>;
}

const AtlatContext = createContext<AtlatContextType | null>(null);

export function AtlatProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [
  scrollToPage,
  setScrollToPage,
] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const goToPage = (page: number) => {
  setCurrentPage(page);
};
  const [scale, setScale] = useState(1);
  const [recentPages, setRecentPages] =
  useState<
    {
      page: number;
      time: number;
    }[]
  >([]);
  const [notifications, setNotifications] = useState(() =>
  defaultNotifications.map((item) => ({
    ...item,
    read: false,
  }))
);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [notes, setNotes] = useState<Record<number, string>>({});
const [visitedPages, setVisitedPages] = useState<number[]>([]);

const [history, setHistory] = useState<number[]>([]);
useEffect(() => {
  const data = localStorage.getItem("geoedu-notifications");

  if (data) {
    try {
      const data = localStorage.getItem("geoedu-notifications");

if (data) {
  try {
    const parsed = JSON.parse(data) as {
      id: number;
      title: string;
      content: string;
      read: boolean;
      createdAt: number;
    }[];

    const saved = JSON.parse(data);

setNotifications(
  defaultNotifications.map((item) => {
    const old = saved.find(
      (n: any) => n.id === item.id
    );

    return {
      ...item,
      read: old?.read ?? false,
    };
  })
);
  } catch {}
}
    } catch {}
  }
}, []);
useEffect(() => {
  localStorage.setItem(
    "geoedu-notifications",
    JSON.stringify(notifications)
  );
}, [notifications]);  
// Load bookmark khi mở web
  useEffect(() => {
    const data = localStorage.getItem("geoedu-bookmarks");

    if (data) {
      try {
        setBookmarks(JSON.parse(data));
      } catch {
        setBookmarks([]);
      }
    }
  }, []);
  useEffect(() => {
  const data = localStorage.getItem("geoedu-history");

  if (data) {
    try {
      setHistory(JSON.parse(data));
    } catch {
      setHistory([]);
    }
  }
}, []);
useEffect(() => {
  const visited = localStorage.getItem("geoedu-visited");
  const history = localStorage.getItem("geoedu-history");

  if (visited) {
    try {
      setVisitedPages(JSON.parse(visited));
    } catch {}
  }

  if (history) {
    try {
      setHistory(JSON.parse(history));
    } catch {}
  }
}, []);
// Load Notes
useEffect(() => {
  const data = localStorage.getItem("geoedu-notes");

  if (data) {
    try {
      setNotes(JSON.parse(data));
    } catch {
      setNotes({});
    }
  }
}, []);
  // Tự lưu bookmark
  useEffect(() => {
    localStorage.setItem(
      "geoedu-bookmarks",
      JSON.stringify(bookmarks)
    );
  }, [bookmarks]);
  useEffect(() => {
  localStorage.setItem(
    "geoedu-history",
    JSON.stringify(history)
  );
}, [history]);
  useEffect(() => {
  localStorage.setItem(
    "geoedu-notes",
    JSON.stringify(notes)
  );
}, [notes]);
useEffect(() => {
  localStorage.setItem(
    "geoedu-visited",
    JSON.stringify(visitedPages)
  );
}, [visitedPages]);

useEffect(() => {
  localStorage.setItem(
    "geoedu-history",
    JSON.stringify(history)
  );
}, [history]);
  return (
    <AtlatContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        scrollToPage,
        setScrollToPage,
        totalPages,
        setTotalPages,

        scale,
        setScale,

        bookmarks,
        setBookmarks,
        notes,
        setNotes,
        visitedPages,
        setVisitedPages,
        history,
        setHistory,
        recentPages,
        setRecentPages,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </AtlatContext.Provider>
  );
}

export function useAtlat() {
  const context = useContext(AtlatContext);

  if (!context) {
    throw new Error(
      "useAtlat phải được dùng trong AtlatProvider"
    );
  }

  return context;
}
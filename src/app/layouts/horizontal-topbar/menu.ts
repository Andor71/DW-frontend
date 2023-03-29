import { MenuItem } from "./menu.model";

export const MENU_ADMIN: MenuItem[] = [
  {
    id: 1,
    label: "Periódusok",
    icon: "ri-honour-line",
    link: "periods",
  },
];

export const MENU_TEACHER: MenuItem[] = [
  {
    id: 1,
    label: "Diplomáim",
    icon: " ri-book-2-fill",
    link: "diplomas",
  },
];

export const MENU_DEPARTMENTHEAD: MenuItem[] = [
  {
    id: 1,
    label: "Diplomáim",
    icon: " ri-book-2-fill",
    link: "diplomas",
  },
  {
    id: 2,
    label: "Diploma jelentkezések",
    icon: " ri-book-2-fill",
    link: "diploma-applies",
  },
];
export const MENU_STUDENT: MenuItem[] = [
  {
    id: 1,
    label: "Diplomák",
    icon: " ri-book-2-fill",
    link: "diplomas",
  },
];

import type { Course } from "@/types";

export const courses: Course[] = [
  {
    id: 1,
    title: "Математичка Анализа 1",
    description:
      "Комплетна подготовка за испитот по Математичка Анализа 1 со сите потребни техники и задачи.",
    category: "ФИНКИ",
    price: "2.500 ден",
    instructor: {
      name: "Проф. Марија Петровска",
      avatar:
        "https://images.unsplash.com/photo-1551727981-bfe3e86eaa00?w=80&h=80&fit=crop",
    },
    level: "Beginner",
    duration: "12 недели",
    thumbnail:
      "https://images.unsplash.com/photo-1569997851406-472ce7b75c6c?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Основи на Програмирање",
    description:
      "Научи ги основите на програмирањето со практични примери и вежби.",
    category: "ФИНКИ",
    price: "3.000 ден",
    instructor: {
      name: "Проф. Александар Николов",
      avatar:
        "https://images.unsplash.com/photo-1758685734503-58a8accc24e8?w=80&h=80&fit=crop",
    },
    level: "Beginner",
    duration: "10 недели",
    thumbnail:
      "https://images.unsplash.com/photo-1617240016072-d92174e44171?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Електронски Системи",
    description:
      "Задлабочена подготовка за испитот по Електронски Системи со задачи и лабораториски вежби.",
    category: "ФЕИТ",
    price: "2.800 ден",
    instructor: {
      name: "Проф. Марија Петровска",
      avatar:
        "https://images.unsplash.com/photo-1551727981-bfe3e86eaa00?w=80&h=80&fit=crop",
    },
    level: "Intermediate",
    duration: "8 недели",
    thumbnail:
      "https://images.unsplash.com/photo-1727522974676-c2f9c32ee692?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    title: "Макроекономија",
    description:
      "Темелна подготовка за испитот по Макроекономија со сите видови задачи и анализи.",
    category: "Економски",
    price: "2.200 ден",
    instructor: {
      name: "Проф. Александар Николов",
      avatar:
        "https://images.unsplash.com/photo-1758685734503-58a8accc24e8?w=80&h=80&fit=crop",
    },
    level: "Beginner",
    duration: "6 недели",
    thumbnail:
      "https://images.unsplash.com/photo-1736751035793-353baaa416cf?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    title: "Структури на Податоци",
    description:
      "Детална обука за структури на податоци и алгоритми со практични примери.",
    category: "ФИНКИ",
    price: "3.200 ден",
    instructor: {
      name: "Проф. Марија Петровска",
      avatar:
        "https://images.unsplash.com/photo-1551727981-bfe3e86eaa00?w=80&h=80&fit=crop",
    },
    level: "Intermediate",
    duration: "14 недели",
    thumbnail:
      "https://images.unsplash.com/photo-1617240016072-d92174e44171?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    title: "Механика на Флуиди",
    description: "Сеопфатна припрема за испитот со теорија, задачи и симулации.",
    category: "Машински",
    price: "2.600 ден",
    instructor: {
      name: "Проф. Александар Николов",
      avatar:
        "https://images.unsplash.com/photo-1758685734503-58a8accc24e8?w=80&h=80&fit=crop",
    },
    level: "Intermediate",
    duration: "9 недели",
    thumbnail:
      "https://images.unsplash.com/photo-1727522974676-c2f9c32ee692?w=400&h=300&fit=crop",
  },
  {
    id: 7,
    title: "Финансиска Сметководство",
    description:
      "Прецизна подготовка за испито со практични примери и анализа на случаи.",
    category: "Економски",
    price: "2.400 ден",
    instructor: {
      name: "Проф. Марија Петровска",
      avatar:
        "https://images.unsplash.com/photo-1551727981-bfe3e86eaa00?w=80&h=80&fit=crop",
    },
    level: "Beginner",
    duration: "7 недели",
    thumbnail:
      "https://images.unsplash.com/photo-1736751035793-353baaa416cf?w=400&h=300&fit=crop",
  },
  {
    id: 8,
    title: "Дигитална Електроника",
    description:
      "Комплетна обука за дигитална електроника со лабораториски вежби и симулации.",
    category: "ФЕИТ",
    price: "2.900 ден",
    instructor: {
      name: "Проф. Александар Николов",
      avatar:
        "https://images.unsplash.com/photo-1758685734503-58a8accc24e8?w=80&h=80&fit=crop",
    },
    level: "Intermediate",
    duration: "11 недели",
    thumbnail:
      "https://images.unsplash.com/photo-1727522974676-c2f9c32ee692?w=400&h=300&fit=crop",
  },
];

export const courseFilters = ["Сите", "ФИНКИ", "ФЕИТ", "Економски", "Машински"];

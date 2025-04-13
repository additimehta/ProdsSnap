
import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Eco Friendly Water Bottle",
    description: "Sustainable water bottle made from recycled materials",
    price: 24.99,
    image: "/placeholder.svg",
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-04-02T14:45:00Z",
    versions: [
      {
        id: "v1",
        productId: "1",
        versionNumber: "1.0.0",
        changes: "Initial product launch",
        createdAt: "2025-01-15T10:30:00Z",
        createdBy: "John Doe"
      },
      {
        id: "v2",
        productId: "1",
        versionNumber: "1.1.0",
        changes: "Added new color options",
        createdAt: "2025-02-20T09:15:00Z",
        createdBy: "Jane Smith"
      },
      {
        id: "v3",
        productId: "1",
        versionNumber: "1.2.0",
        changes: "Improved lid design",
        createdAt: "2025-04-02T14:45:00Z",
        createdBy: "John Doe"
      }
    ]
  },
  {
    id: "2",
    name: "Smart Home Hub",
    description: "Control all your smart devices from one central hub",
    price: 129.99,
    image: "/placeholder.svg",
    createdAt: "2025-01-20T11:45:00Z",
    updatedAt: "2025-03-15T16:30:00Z",
    versions: [
      {
        id: "v1",
        productId: "2",
        versionNumber: "1.0.0",
        changes: "Initial product launch",
        createdAt: "2025-01-20T11:45:00Z",
        createdBy: "Sarah Johnson"
      },
      {
        id: "v2",
        productId: "2",
        versionNumber: "1.1.0",
        changes: "Added voice control support",
        createdAt: "2025-03-15T16:30:00Z",
        createdBy: "Mike Brown"
      }
    ]
  },
  {
    id: "3",
    name: "Ergonomic Office Chair",
    description: "Comfortable chair with proper lumbar support",
    price: 249.99,
    image: "/placeholder.svg",
    createdAt: "2025-02-05T13:20:00Z",
    updatedAt: "2025-03-28T10:15:00Z",
    versions: [
      {
        id: "v1",
        productId: "3",
        versionNumber: "1.0.0",
        changes: "Initial product launch",
        createdAt: "2025-02-05T13:20:00Z",
        createdBy: "Emily Clark"
      },
      {
        id: "v2",
        productId: "3",
        versionNumber: "1.1.0",
        changes: "Improved armrest adjustability",
        createdAt: "2025-03-10T15:45:00Z",
        createdBy: "David Wilson"
      },
      {
        id: "v3",
        productId: "3",
        versionNumber: "1.2.0",
        changes: "Added headrest option",
        createdAt: "2025-03-28T10:15:00Z",
        createdBy: "Emily Clark"
      }
    ]
  },
  {
    id: "4",
    name: "Wireless Earbuds",
    description: "Premium sound quality with noise cancellation",
    price: 89.99,
    image: "/placeholder.svg",
    createdAt: "2025-02-10T09:30:00Z",
    updatedAt: "2025-04-05T11:20:00Z",
    versions: [
      {
        id: "v1",
        productId: "4",
        versionNumber: "1.0.0",
        changes: "Initial product launch",
        createdAt: "2025-02-10T09:30:00Z",
        createdBy: "Alex Taylor"
      },
      {
        id: "v2",
        productId: "4",
        versionNumber: "1.1.0",
        changes: "Improved battery life",
        createdAt: "2025-03-20T14:10:00Z",
        createdBy: "Lisa Martin"
      },
      {
        id: "v3",
        productId: "4",
        versionNumber: "1.2.0",
        changes: "Added water resistance",
        createdAt: "2025-04-05T11:20:00Z",
        createdBy: "Alex Taylor"
      }
    ]
  },
  {
    id: "5",
    name: "Smart Fitness Tracker",
    description: "Track your health and fitness goals",
    price: 79.99,
    image: "/placeholder.svg",
    createdAt: "2025-02-15T15:40:00Z",
    updatedAt: "2025-04-10T13:25:00Z",
    versions: [
      {
        id: "v1",
        productId: "5",
        versionNumber: "1.0.0",
        changes: "Initial product launch",
        createdAt: "2025-02-15T15:40:00Z",
        createdBy: "Tom Miller"
      },
      {
        id: "v2",
        productId: "5",
        versionNumber: "1.1.0",
        changes: "Added sleep tracking feature",
        createdAt: "2025-03-25T12:35:00Z",
        createdBy: "Rachel Green"
      },
      {
        id: "v3",
        productId: "5",
        versionNumber: "1.2.0",
        changes: "Improved heart rate monitoring",
        createdAt: "2025-04-10T13:25:00Z",
        createdBy: "Tom Miller"
      }
    ]
  },
  {
    id: "6",
    name: "Portable Bluetooth Speaker",
    description: "Powerful sound in a compact, portable design",
    price: 59.99,
    image: "/placeholder.svg",
    createdAt: "2025-03-01T10:10:00Z",
    updatedAt: "2025-04-12T09:50:00Z",
    versions: [
      {
        id: "v1",
        productId: "6",
        versionNumber: "1.0.0",
        changes: "Initial product launch",
        createdAt: "2025-03-01T10:10:00Z",
        createdBy: "Chris Evans"
      },
      {
        id: "v2",
        productId: "6",
        versionNumber: "1.1.0",
        changes: "Improved waterproofing",
        createdAt: "2025-04-12T09:50:00Z",
        createdBy: "Natasha Romanoff"
      }
    ]
  }
];

export const getCurrentUser = () => {
  return {
    id: "u1",
    name: "Demo User",
    email: "user@example.com",
    avatar: "/placeholder.svg"
  };
};

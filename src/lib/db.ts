// IndexedDB utilities for Agently Landlord
const DB_NAME = "agently_landlord";
const DB_VERSION = 1;

export interface Property {
  id: string;
  name: string;
  address: string;
  type: "apartment" | "house" | "office" | "commercial";
  units: number;
  createdAt: string;
}

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  bedrooms?: number;
  bathrooms?: number;
  rent: number;
  status: "occupied" | "vacant" | "maintenance";
  tenantId?: string;
  createdAt: string;
}

export interface Tenant {
  id: string;
  unitId: string;
  propertyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  leaseStart: string;
  leaseEnd: string;
  rentAmount: number;
  rentFrequency: "monthly" | "quarterly" | "yearly";
  paymentStatus: "paid" | "owing" | "unpaid";
  balance: number;
  createdAt: string;
}

export interface Payment {
  id: string;
  tenantId: string;
  unitId: string;
  propertyId: string;
  amount: number;
  date: string;
  method: "bank_transfer" | "card" | "cash" | "mobile_money";
  status: "completed" | "pending" | "failed";
  receiptNumber: string;
  createdAt: string;
}

export interface MaintenanceRequest {
  id: string;
  tenantId: string;
  unitId: string;
  propertyId: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "completed";
  images?: string[];
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  propertyId: string;
  category: "repairs" | "taxes" | "utilities" | "insurance" | "other";
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

let db: IDBDatabase | null = null;

export async function initDB(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Create object stores
      if (!database.objectStoreNames.contains("properties")) {
        database.createObjectStore("properties", { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains("units")) {
        const unitStore = database.createObjectStore("units", { keyPath: "id" });
        unitStore.createIndex("propertyId", "propertyId", { unique: false });
      }
      if (!database.objectStoreNames.contains("tenants")) {
        const tenantStore = database.createObjectStore("tenants", { keyPath: "id" });
        tenantStore.createIndex("unitId", "unitId", { unique: false });
        tenantStore.createIndex("propertyId", "propertyId", { unique: false });
      }
      if (!database.objectStoreNames.contains("payments")) {
        const paymentStore = database.createObjectStore("payments", { keyPath: "id" });
        paymentStore.createIndex("tenantId", "tenantId", { unique: false });
        paymentStore.createIndex("propertyId", "propertyId", { unique: false });
      }
      if (!database.objectStoreNames.contains("maintenance")) {
        const maintenanceStore = database.createObjectStore("maintenance", { keyPath: "id" });
        maintenanceStore.createIndex("propertyId", "propertyId", { unique: false });
        maintenanceStore.createIndex("tenantId", "tenantId", { unique: false });
      }
      if (!database.objectStoreNames.contains("expenses")) {
        const expenseStore = database.createObjectStore("expenses", { keyPath: "id" });
        expenseStore.createIndex("propertyId", "propertyId", { unique: false });
      }
    };
  });
}

// Generic CRUD operations
export async function add<T>(storeName: string, data: T): Promise<void> {
  const database = await initDB();
  const transaction = database.transaction(storeName, "readwrite");
  const store = transaction.objectStore(storeName);
  await store.add(data);
}

export async function getAll<T>(storeName: string): Promise<T[]> {
  const database = await initDB();
  const transaction = database.transaction(storeName, "readonly");
  const store = transaction.objectStore(storeName);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getById<T>(storeName: string, id: string): Promise<T | undefined> {
  const database = await initDB();
  const transaction = database.transaction(storeName, "readonly");
  const store = transaction.objectStore(storeName);
  return new Promise((resolve, reject) => {
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function update<T>(storeName: string, data: T): Promise<void> {
  const database = await initDB();
  const transaction = database.transaction(storeName, "readwrite");
  const store = transaction.objectStore(storeName);
  await store.put(data);
}

export async function remove(storeName: string, id: string): Promise<void> {
  const database = await initDB();
  const transaction = database.transaction(storeName, "readwrite");
  const store = transaction.objectStore(storeName);
  await store.delete(id);
}

export async function getByIndex<T>(
  storeName: string,
  indexName: string,
  value: string
): Promise<T[]> {
  const database = await initDB();
  const transaction = database.transaction(storeName, "readonly");
  const store = transaction.objectStore(storeName);
  const index = store.index(indexName);
  return new Promise((resolve, reject) => {
    const request = index.getAll(value);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

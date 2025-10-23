import React, { useEffect, useMemo, useState } from "react";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import {
  collection,
  getDocs,
  orderBy,
  limit,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import {
  SearchIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  ShieldIcon,
  UsersIcon,
  TrendingUpIcon,
  FilterIcon,
  EyeIcon,
  EditIcon,
} from "lucide-react";

type Customer = {
  uid: string;
  email?: string;
  name?: string;
  phone?: string;
  role?: string;
  createdAt?: string | number;
  lastLogin?: string | number;
  totalOrders?: number;
  totalSpent?: number;
};

export const Customers: React.FC = () => {
  const { role, loading } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [queryText, setQueryText] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | "admin" | "user">("All");
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [sortBy, setSortBy] = useState<
    "name" | "email" | "createdAt" | "totalSpent"
  >("createdAt");
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  // 🔥 Load Users from Firestore
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersRef = collection(db, "Users");
        const q = query(usersRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const users = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            uid: docSnap.id,
            ...data,
          } as Customer;
        });

        setCustomers(users);
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoadingCustomers(false);
      }
    };

    loadUsers();
  }, []);

  // 🧮 Filtering + Sorting
  const filtered = useMemo(() => {
    let filteredCustomers = customers.filter((c) => {
      const q = queryText.toLowerCase();
      const matchesQuery = queryText
        ? c.email?.toLowerCase().includes(q) ||
          c.name?.toLowerCase().includes(q) ||
          c.uid.toLowerCase().includes(q)
        : true;
      const matchesRole =
        roleFilter === "All"
          ? true
          : (c.role || "user").toLowerCase() === roleFilter;
      return matchesQuery && matchesRole;
    });

    filteredCustomers.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "email":
          return (a.email || "").localeCompare(b.email || "");
        case "totalSpent":
          return (b.totalSpent || 0) - (a.totalSpent || 0);
        case "createdAt":
        default:
          const aDate = new Date(a.createdAt || 0).getTime();
          const bDate = new Date(b.createdAt || 0).getTime();
          return bDate - aDate;
      }
    });

    return filteredCustomers;
  }, [customers, queryText, roleFilter, sortBy]);

  // 🔄 Update Role
  const updateCustomerRole = async (uid: string, newRole: string) => {
    setUpdatingUid(uid);
    try {
      const userRef = doc(db, "Users", uid);
      await updateDoc(userRef, { role: newRole });
      setCustomers((prev) =>
        prev.map((c) => (c.uid === uid ? { ...c, role: newRole } : c))
      );
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setUpdatingUid(null);
    }
  };

  const viewCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetails(true);
  };

  const closeCustomerDetails = () => {
    setShowCustomerDetails(false);
    setSelectedCustomer(null);
  };

  // 🔒 Only Admin Access
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <div className="text-sm text-gray-600">
              {filtered.length} of {customers.length} customers
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <FilterIcon className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Filters & Search
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="Search by UID, name or email"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Role Filter */}
              <div className="flex items-center gap-2">
                {(["All", "user", "admin"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      roleFilter === r
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {r === "All" ? "All Roles" : r}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="createdAt">Newest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="email">Email A-Z</option>
                  <option value="totalSpent">Highest Spent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {loadingCustomers ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        Loading customers...
                      </td>
                    </tr>
                  ) : filtered.length > 0 ? (
                    filtered.map((u) => (
                      <tr key={u.uid} className="hover:bg-gray-50">
                        <td className="px-6 py-3">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-primary-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {u.name || "Unknown User"}
                              </div>
                              <div className="text-xs text-gray-500 font-mono">
                                {u.uid.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-700">
                          <div className="space-y-1">
                            {u.email && (
                              <div className="flex items-center">
                                <MailIcon className="h-3 w-3 mr-1 text-gray-400" />
                                <span className="text-xs">{u.email}</span>
                              </div>
                            )}
                            {u.phone && (
                              <div className="flex items-center">
                                <PhoneIcon className="h-3 w-3 mr-1 text-gray-400" />
                                <span className="text-xs">{u.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <select
                            value={u.role || "user"}
                            onChange={(e) =>
                              updateCustomerRole(u.uid, e.target.value)
                            }
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                            disabled={updatingUid === u.uid}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-500">
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <button
                            onClick={() => viewCustomerDetails(u)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No customers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

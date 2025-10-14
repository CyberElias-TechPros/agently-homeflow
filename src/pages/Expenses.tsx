import { useEffect, useState } from "react";
import { Plus, TrendingDown, Calendar, Search } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddExpenseDialog from "@/components/AddExpenseDialog";
import { getAll, Expense, Property, getById } from "@/lib/db";

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [properties, setProperties] = useState<Map<string, Property>>(new Map());
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    const expensesData = await getAll<Expense>("expenses");
    setExpenses(expensesData);

    const propsMap = new Map<string, Property>();
    for (const expense of expensesData) {
      if (!propsMap.has(expense.propertyId)) {
        const property = await getById<Property>("properties", expense.propertyId);
        if (property) propsMap.set(property.id, property);
      }
    }
    setProperties(propsMap);
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredExpenses = expenses
    .filter((expense) => {
      const property = properties.get(expense.propertyId);
      const matchesSearch = searchQuery === "" || 
        property?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const thisMonth = expenses
    .filter(e => {
      const expenseDate = new Date(e.date);
      const now = new Date();
      return expenseDate.getMonth() === now.getMonth() && 
             expenseDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])[0];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
            <p className="text-muted-foreground">
              Track and manage property expenses
            </p>
          </div>
          <AddExpenseDialog onSuccess={loadExpenses} />
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(thisMonth)}</div>
              <p className="text-xs text-muted-foreground">{expenses.length} transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Category</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {topCategory ? topCategory[0] : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {topCategory ? formatCurrency(topCategory[1]) : "No expenses"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Expense List */}
        <Card>
          <CardHeader>
            <CardTitle>Expense History</CardTitle>
            <CardDescription>Search and filter property expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by property or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="repairs">Repairs</SelectItem>
                  <SelectItem value="taxes">Taxes</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {filteredExpenses.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingDown className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No expenses found</p>
                </div>
              ) : (
                filteredExpenses.map((expense) => {
                  const property = properties.get(expense.propertyId);

                  return (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="capitalize">
                            {expense.category}
                          </Badge>
                          <p className="font-medium">{expense.description}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {property?.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-destructive">
                          -{formatCurrency(expense.amount)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

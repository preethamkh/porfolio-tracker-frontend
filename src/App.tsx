import { formatCurrency, formatPercent } from "@/utils/formatters";
//import { User, Portfolio } from "@/types";
import { isAuthenticated } from "@/api/client";
import { ENV } from "@/utils/constants";
console.log(formatCurrency(15368.0)); // "$15,368.00"
console.log(formatPercent(0.0402)); // "+4.02%"

console.log("Is authenticated:", isAuthenticated()); // false (no token yet)

// const user: User = {
//   id: "123",
//   email: "test@test.com",
//   createdAt: new Date().toISOString(),
//   //updatedAt: new Date().toISOString(),
// };

function App() {
  return (
    <>
      <div className="p-8">
        <h1 className="text-3xl font-bold">Portfolio Tracker</h1>
        <p className="text-muted-foreground">Setup successful! </p>

        <div className="mt-4 space-y-2">
          <p>Currency: {formatCurrency(15368.0, "EUR", false)}</p>
          <p>Percent: {formatPercent(0.0402)}</p>
          <p>API URL: {ENV.API_BASE_URL}</p>
        </div>
      </div>
    </>
  );
}

export default App;

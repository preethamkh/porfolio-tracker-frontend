// TODO: enrich with notes and commentary about the implementation before phase 3
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import SecuritySearchCombobox from "@/components/securities/SecuritySearchCombobox";
import { useCreateTransaction } from "@/api/hooks/useTransactions";
import { useGetOrCreateSecurity } from "@/api/hooks/useSecurities";
import type { SecuritySearchResult } from "@/types";

import {
  findHoldingBySecurityId,
  createHolding,
} from "@/api/endpoints/holdings";

// Validation schema using Zod
const transactionFormSchema = z.object({
  symbol: z.string().min(1, "Please select a security"),
  transactionType: z.enum(["Buy", "Sell"], {
    required_error: "Please select a transaction type",
  }),
  shares: z.coerce
    .number()
    .positive("Shares must be greater than 0")
    .min(0.0001, "Shares must be at least 0.0001"),
  pricePerShare: z.coerce
    .number()
    .positive("Price must be greater than 0")
    .min(0.01, "Price must be at least $0.01"),
  fees: z.coerce
    .number()
    .min(0, "Fees cannot be negative")
    .optional()
    .default(0),
  transactionDate: z.date({
    required_error: "Please select a transaction date",
  }),
  notes: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

interface AddTransactionDialogProps {
  portfolioId: string;
  trigger?: React.ReactNode;
}

export default function AddTransactionDialog({
  portfolioId,
  trigger,
}: AddTransactionDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedSecurity, setSelectedSecurity] =
    useState<SecuritySearchResult | null>(null);

  const createTransaction = useCreateTransaction();
  const getOrCreateSecurity = useGetOrCreateSecurity();

  // Initialize form with react-hook-form
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      symbol: "",
      transactionType: "Buy",
      shares: 0,
      pricePerShare: 0,
      fees: 0,
      transactionDate: new Date(),
      notes: "",
    },
  });

  // Calculate total amount based on shares, price, and fees
  const watchShares = form.watch("shares");
  const watchPrice = form.watch("pricePerShare");
  const watchFees = form.watch("fees") || 0;
  const watchType = form.watch("transactionType");

  const totalAmount =
    watchShares * watchPrice + (watchType === "Buy" ? watchFees : -watchFees);

  // Handle security selection from search
  const handleSecuritySelect = (security: SecuritySearchResult) => {
    setSelectedSecurity(security);
    form.setValue("symbol", security.symbol);
    form.clearErrors("symbol");
  };

  // Handle form submission
  const onSubmit = async (values: TransactionFormValues) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      // Step 1: Get or create the security
      console.log("Step 1: Getting security...");
      const security = await getOrCreateSecurity.mutateAsync({
        symbol: values.symbol,
      });
      console.log("Security:", security);

      // Step 2: Find existing holding for this security
      console.log("Step 2: Finding holding...");
      let holding = await findHoldingBySecurityId(
        user.id,
        portfolioId,
        security.id,
      );
      console.log("Found holding:", holding);

      // Step 3: If no holding exists, create one
      if (!holding) {
        console.log("Step 3: Creating new holding...");
        holding = await createHolding(portfolioId, user.id, {
          securityId: security.id,
          totalShares: 0,
          averageCost: 0,
        });
        console.log("Created holding:", holding);
      }

      // Step 4: Create the transaction
      console.log("Step 4: Creating transaction...");
      console.log("Holding object:", holding);
      const holdingIdValue = holding.holdingId || holding.id;
      console.log("Holding ID:", holdingIdValue);
      console.log("Raw form values:", values);
      const transactionData = {
        holdingId: holdingIdValue,
        transactionType: values.transactionType,
        shares: Number(values.shares),
        pricePerShare: Number(values.pricePerShare),
        fees: Number(values.fees) || 0,
        transactionDate: values.transactionDate.toISOString(),
        notes: values.notes || undefined,
      };
      console.log("Transaction data:", transactionData);
      console.log(
        "JSON that will be sent:",
        JSON.stringify(transactionData, null, 2),
      );

      await createTransaction.mutateAsync({
        userId: user.id,
        portfolioId: portfolioId,
        data: transactionData,
      });

      // Step 4: Close dialog and reset form
      setOpen(false);
      form.reset();
      setSelectedSecurity(null);
    } catch (error) {
      console.error("Failed to create transaction:", error);
      // Error toast is handled by the mutation hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-teal-600 hover:bg-teal-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Record a buy or sell transaction for your portfolio.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Security Search */}
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Security</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <SecuritySearchCombobox
                        onSelect={handleSecuritySelect}
                        placeholder="Search for a stock or ETF..."
                      />
                      {selectedSecurity && (
                        <div className="flex items-center gap-2 p-3 bg-teal-50 border border-teal-200 rounded-lg">
                          <div className="flex-1">
                            <p className="font-semibold text-teal-900">
                              {selectedSecurity.symbol}
                            </p>
                            <p className="text-sm text-teal-700">
                              {selectedSecurity.name}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedSecurity(null);
                              form.setValue("symbol", "");
                            }}
                          >
                            Change
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Transaction Type */}
            <FormField
              control={form.control}
              name="transactionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transaction type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Buy">Buy</SelectItem>
                      <SelectItem value="Sell">Sell</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Shares and Price - Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="shares"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shares</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.0001"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pricePerShare"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Per Share</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Fees and Date - Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fees (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Trading fees or commissions
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transactionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Total Amount Display */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Total Amount:
                </span>
                <span className="text-lg font-bold text-gray-900">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {Number(watchShares) || 0} shares × $
                {(Number(watchPrice) || 0).toFixed(2)}
                {watchFees > 0 &&
                  ` + $${(Number(watchFees) || 0).toFixed(2)} fees`}
              </p>
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Add any notes about this transaction..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  createTransaction.isPending || getOrCreateSecurity.isPending
                }
              >
                {createTransaction.isPending || getOrCreateSecurity.isPending
                  ? "Adding..."
                  : "Add Transaction"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

import SecuritySearchCombobox from "@/components/securities/SecuritySearchCombobox";

export default function SearchTest() {
    return (
        <div className="p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Security Search Test</h1>
            <SecuritySearchCombobox
                onSelect={(security) => {
                    console.log('Selected:', security);
                    alert(`Selected: ${security.symbol} - ${security.name}`);
                }}
            />
        </div>
    );
}
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useId } from "react";
import { ToolsResponse, ToolRentalChargesResponse } from "./interfaces";
import { GetTools, GetRentalCharges } from "./utils/api";
import "./App.css";

function App() {
  const [selectedTool, setSelectedTool] = useState<ToolRentalChargesResponse>();

  const DISCOUNT_RANGE = {min: 0, max: 100};
  const [discountValue, setDiscountValue] = useState<number>(0);
  const discountInputId = useId();

  const { data: toolsData, refetch: toolsRefetch } = GetTools();

  const {
    data: toolRentalChargesData,
    refetch: toolRentalChargesRefetch,
    status: toolRentalChargesStatus,
  } = GetRentalCharges();

  useEffect(() => {
    // fetch each json file once, on mount
    toolsRefetch();
    toolRentalChargesRefetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TEMP, FOR TESTING
  useEffect(() => {
    console.log(toolRentalChargesData, toolsData);
  }, [toolRentalChargesData, toolsData]);

  useEffect(() => {
    console.log("selectedTool", selectedTool);
  }, [selectedTool]);
  // END TEMP, FOR TESTING

  const toolSelectOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTool(JSON.parse(event.target.value));
  };

  const discountValueOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const discountVal = Math.max(Math.min(Number(event.target.value), DISCOUNT_RANGE.max), DISCOUNT_RANGE.min);
    setDiscountValue(discountVal);
  };

  return (
    <>
      {/* Component - Tool Select */}
      {toolRentalChargesData !== undefined &&
      toolRentalChargesStatus === "success" ? (
        <div>
          <select
            id="tool"
            name="tool"
            onChange={toolSelectOnChange}
            defaultValue="{}"
            className="mt-2 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="{}">Choose a tool...</option>
            {toolRentalChargesData.map((tool: ToolRentalChargesResponse) => (
              <option
                key={`${tool.type}-dropdown`}
                value={JSON.stringify(tool)}
                className="flex justify-between"
              >
                {tool.type}-{tool.dailyCharge}
              </option>
            ))}
          </select>
        </div>
      ) : toolRentalChargesStatus === "error" ? (
        <h2>There was an error initializing the tool list</h2>
      ) : (
        <h2>Initializing Tool Rental...</h2>
      )}
      {/* Component - Discount */}
      <label htmlFor={discountInputId} className="text-sm pr-2">
        Discount:
      </label>
      <input
        type="number"
        id={discountInputId}
        name="discountInput"
        value={discountValue}
        onChange={discountValueOnChange}
        min={DISCOUNT_RANGE.min}
        max={DISCOUNT_RANGE.max}
        defaultValue={DISCOUNT_RANGE.min}
        className="mt-2 rounded-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
      {/* Component - Date Range Picker */}
      {selectedTool?.type !== undefined ? <div>date picker placeholder</div> : null}
    </>
  );
}

export default App;

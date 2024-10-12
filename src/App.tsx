/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useId } from "react";
import { ToolsResponse, ToolRentalChargesResponse } from "./interfaces";
import { GetTools, GetRentalCharges } from "./utils/api";
import "./App.css";
import DatePicker from "react-datepicker";
import { addDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [selectedTool, setSelectedTool] = useState<ToolRentalChargesResponse>();

  // Discount Component
  const DISCOUNT_RANGE = { min: 0, max: 100 };
  const [discountValue, setDiscountValue] = useState<number>(0);
  const discountInputId = useId();

  // Datepicker Component
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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
    console.log('discountValue',discountValue);
  }, [discountValue]);

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

  const discountValueOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const discountVal = Math.max(
      Math.min(Number(event.target.value), DISCOUNT_RANGE.max),
      DISCOUNT_RANGE.min
    );
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
                {tool.type} - (${tool.dailyCharge}/day)
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
      <div className="mt-2">
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
          className="mt-2 mr-1 rounded-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
        %
      </div>
      {/* Component - Date Range Picker */}
      <div className="flex gap-2 mt-3">
        {selectedTool?.type !== undefined ? (
          <div>
            <h3 className="font-bold text-sm">Start Date:</h3>
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                setEndDate(null);
              }}
              minDate={new Date()}
              inline
            />
          </div>
        ) : null}

        {selectedTool?.type !== undefined && startDate !== null ? (
          <div>
            <h3 className="font-bold text-sm">End Date:</h3>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              minDate={addDays(startDate, 1)}
              inline
            />
          </div>
        ) : null}
      </div>

      {/* Component - get Rental Agreement */}
      {(selectedTool?.type !== undefined && startDate !== null && endDate !== null) ?
      <button
        type="button"
        className="mt-3 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Get Rental Agreement
      </button>
      
      : null }
    </>
  );
}

export default App;

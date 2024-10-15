/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useId } from "react";
import {
  ToolsResponse,
  ToolRentalChargesResponse,
  ToolFullData,
} from "./interfaces";
import { GetTools, GetRentalCharges } from "./utils/api";
import { billableDays, formattedDate } from "./utils";
import RentalAgreement from "./components/RentalAgreement";
import "./App.css";
import DatePicker from "react-datepicker";
import { format, addDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [selectedTool, setSelectedTool] = useState<ToolFullData>();
  const [toolFullData, setToolFullData] = useState<ToolFullData[]>();

  // Discount Component
  const DISCOUNT_RANGE = { min: 0, max: 100 };
  const [discountValue, setDiscountValue] = useState<number>(0);
  const discountInputId = useId();

  // Datepicker Component
  const [startDate, setStartDate] = useState<Date | null>(null);
  const startDateFormatted = formattedDate(startDate);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const endDateFormatted = formattedDate(endDate);

  const {
    data: toolsData,
    refetch: toolsRefetch,
    status: toolStatus,
  } = GetTools();

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

  useEffect(() => {
    if (toolsData !== undefined && toolRentalChargesData !== undefined) {
      const fullToolData: ToolFullData[] = toolsData.map(
        (tool: ToolsResponse) => {
          const toolByType = toolRentalChargesData.find(
            (rentalCharge: ToolRentalChargesResponse) =>
              rentalCharge.type === tool.type
          );
          return {
            ...tool,
            dailyCharge: toolByType?.dailyCharge || 0,
            charges: toolByType?.charges || undefined,
          };
        }
      );
      setToolFullData(fullToolData);
    }
  }, [toolsData, toolRentalChargesData]);

  // TEMP, FOR TESTING
  useEffect(() => {
    console.log("toolFullData", toolFullData);
  }, [toolFullData]);

  useEffect(() => {
    console.log("discountValue", discountValue);
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

  // Temp
  useEffect(() => {
    if (
      selectedTool?.charges !== undefined &&
      startDate !== null &&
      endDate !== null
    ) {
      const chargedDays = billableDays(
        startDate,
        endDate,
        selectedTool.charges
      );
      console.log("chargedDays", chargedDays);
    }
  }, [selectedTool?.charges, startDate, endDate]);

  // const getRentalAgreement = (
  //   startDate: Date,
  //   endDate: Date,
  //   tool: ToolFullData,
  //   discount: number
  // ) => {};

  return (
    <>
      {/* Component - Tool Select */}
      {toolFullData !== undefined ? (
        <div>
          <select
            id="tool"
            name="tool"
            onChange={toolSelectOnChange}
            defaultValue="{}"
            className="mt-2 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="{}">Choose a tool...</option>
            {toolFullData.map((tool: ToolFullData) => (
              <option
                key={`${tool.type}-${tool.brand}-dropdown`}
                value={JSON.stringify(tool)}
                className="flex justify-between"
              >
                {tool.type} - {tool.brand} - (${tool.dailyCharge}/day)
              </option>
            ))}
          </select>
        </div>
      ) : toolRentalChargesStatus === "error" || toolStatus === "error" ? (
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
            <h3 className="font-bold text-sm">
              <span>Start Date:</span>
              {startDateFormatted !== null && (
                <span className="font-normal text-gray-600 pl-3">
                  {startDateFormatted}
                </span>
              )}
            </h3>
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

        {selectedTool?.code !== undefined && startDate !== null ? (
          <div>
            <h3 className="font-bold text-sm">
              <span>End Date:</span>
              {endDateFormatted !== null && (
                <span className="font-normal text-gray-600 pl-3">
                  {endDateFormatted}
                </span>
              )}
            </h3>
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
      {selectedTool?.code !== undefined &&
      toolFullData !== undefined &&
      startDate !== null &&
      endDate !== null ? (
        <RentalAgreement
          toolCode={selectedTool.code}
          startDate={startDate}
          endDate={endDate}
          discount={discountValue}
          toolFullData={toolFullData}
        />
      ) : null}
    </>
  );
}

export default App;

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { ToolsResponse, ToolRentalChargesResponse } from "./interfaces";
import { GetTools, GetRentalCharges } from "./utils/api";
import "./App.css";

function App() {
  const [selectedTool, setSelectedTool] = useState<ToolRentalChargesResponse>();
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

  useEffect(() => {
    console.log(toolRentalChargesData, toolsData);
  }, [toolRentalChargesData, toolsData]);

  useEffect(() => {
    console.log("selectedTool", selectedTool);
  }, [selectedTool]);

  const toolSelectOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTool(JSON.parse(event.target.value));
  };

  return (
    <>
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
    </>
  );
}

export default App;

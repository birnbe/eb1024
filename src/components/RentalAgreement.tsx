import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { useState } from "react";
import { ToolFullData } from "../interfaces";
import {
  finalAmount,
  roundToNearestCent,
  getActiveTool,
  formattedDate,
  billableDays,
} from "../utils";

type Props = {
  toolCode: string;
  startDate: Date;
  endDate: Date;
  toolFullData: ToolFullData[];
  discount: number;
};

const RentalAgreement = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setIsError] = useState<string>();
  const [finalCosts, setFinalCosts] = useState<{
    preDiscountAmount: number;
    discountAmount: number;
  }>();

  const activeTool = getActiveTool(props.toolCode, props.toolFullData);
  const showAgreement = () => {
    try {
      const costs = finalAmount(
        props.toolCode,
        props.startDate,
        props.endDate,
        props.discount,
        props.toolFullData
      );
      setFinalCosts(costs);
    } catch (error) {
      if (error instanceof Error) {
        setIsError(error.message);
      } else {
        setIsError(String(error));
      }
    } finally {
      setIsOpen(true);
    }
  };
  return (
    <>
      <button
        className="mt-3 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={() => showAgreement()}
      >
        Get Rental Agreement
      </button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
            <DialogTitle className="font-bold">
              {isError ? "Error creating Rental Agreement" : "Rental Agreement"}
            </DialogTitle>
            <Description>
              {isError ? (
                isError
              ) : (
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                  <div className="text-right">Tool Code:</div>
                  <div>{activeTool?.code}</div>
                  <div className="text-right">Tool Type:</div>
                  <div>{activeTool?.type}</div>
                  <div className="text-right">Tool Brand:</div>
                  <div>{activeTool?.brand}</div>
                  <div className="text-right">Checkout Date:</div>
                  <div>{formattedDate(props.startDate)}</div>
                  <div className="text-right">Return Date:</div>
                  <div>{formattedDate(props.endDate)}</div>
                  <div className="text-right">Daily Rental Charge:</div>
                  <div>${activeTool?.dailyCharge}</div>
                  {activeTool?.charges ? (
                    <>
                      <div className="text-right">Chargeable days:</div>
                      <div>
                        {billableDays(
                          props.startDate,
                          props.endDate,
                          activeTool?.charges
                        )}
                      </div>
                    </>
                  ) : null}
                  {finalCosts ? (
                    <>
                      <div className="text-right">Pre-discount amount:</div>
                      <div>
                        ${roundToNearestCent(finalCosts.preDiscountAmount)}
                      </div>
                      <div className="text-right">Discount percent:</div>
                      <div>{props.discount}%</div>
                      <div className="text-right">Discount amount:</div>
                      <div>
                        ${roundToNearestCent(finalCosts.discountAmount)}
                      </div>
                      <div className="text-right">Final amount:</div>
                      <div className="font-bold">
                        $
                        {roundToNearestCent(
                          finalCosts.preDiscountAmount -
                            finalCosts.discountAmount
                        )}
                      </div>
                    </>
                  ) : null}
                </div>
              )}
            </Description>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-2 rounded-md bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Close
            </button>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default RentalAgreement;

"use client";
import { useFormContext } from "react-hook-form";
import { JSX, useState } from "react";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { useStepper } from "@/src/components/ui/stepper";

import {
  BikeRegistrationFormData,
  bikeRegisterationInitialData,
} from "../model/schema";
import { verifySerialNumber } from "../services/serialNumberApi";

/**
 * First step of the bike registration process
 * Handles serial number verification before proceeding to bike information
 */
const RegisterSerielNumber = (): JSX.Element => {
  const { setStepCompleted, nextStep } = useStepper();
  const { control, watch, setError, reset } =
    useFormContext<BikeRegistrationFormData>();

  const [isLoading, setIsLoading] = useState(false);

  const sn = watch("serialNumber"); // Track serial number input value
  const isDisabled = !sn || isLoading; // Disable button if no serial number or loading

  /**
   * Handles serial number verification
   * On success: Populates form with bike data and proceeds to next step
   * On error: Displays validation error message
   */
  const submithandler = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const res = await verifySerialNumber(sn);

      // Reset form with initial data plus verified bike information
      reset({ ...bikeRegisterationInitialData, ...res.data });

      setStepCompleted(0, true);
      nextStep(); // Proceed to bike information step
    } catch (err) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to verify serial number";
      setError("serialNumber", { message: errorMessage }); // Show validation error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Informational text about warranty extension */}
      <p className="text-base tracking-wide mb-6">
        Register your bike to extend your warranty by 2 years, in addition to
        the 3-year standard coverage when compliant with our{" "}
        <a href="#" className="text-blue-500 underline">
          warranty policy.
        </a>{" "}
        Please visit our warranty policy page for more details.
      </p>

      {/* Serial number input field */}
      <FormField
        control={control}
        name="serialNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold text-sm">
              Enter your bike Serial Number
            </FormLabel>
            <FormControl>
              <Input placeholder="Bike serial number" {...field} />
            </FormControl>
            <FormMessage /> {/* Displays validation errors */}
          </FormItem>
        )}
      />

      {/* Verification button with loading state */}
      <Button
        disabled={isDisabled}
        size={"lg"}
        className="tracking-wider self-end min-w-40"
        type="button"
        onClick={submithandler}
      >
        {isLoading ? (
          <LoaderCircle size={40} className="animate-spin size-6 font-bold" />
        ) : (
          "FIND MY BIKE"
        )}
      </Button>

      {/* Help links for locating serial number */}
      <p className="text-base text-black mt-12">
        Where do I find my serial number on an{" "}
        <a href="#" className="text-blue-500 underline">
          E-Bike
        </a>{" "}
        or a{" "}
        <a href="#" className="text-blue-500 underline">
          Bike
        </a>
        ?
      </p>
    </div>
  );
};

export default RegisterSerielNumber;

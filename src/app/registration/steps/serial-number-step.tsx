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
  bikeRegistrationInitialData,
} from "../schemas/registration-schema";
import { verifySerialNumber } from "../services/bike-serial-verification";

/**
 * Step 1: Serial Number Verification
 * Handles bike serial number verification and fetches bike details
 */
const SerialNumberStep = (): JSX.Element => {
  const { setStepCompleted, nextStep } = useStepper();
  const { control, watch, setError, reset } =
    useFormContext<BikeRegistrationFormData>();

  const [isLoading, setIsLoading] = useState(false);

  const serialNumber = watch("serialNumber");
  const isDisabled = !serialNumber || isLoading;

  /**
   * Verifies serial number and populates bike information
   */
  const handleVerify = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await verifySerialNumber(serialNumber);

      // Populate form with bike details
      reset({ ...bikeRegistrationInitialData, ...response.data });

      setStepCompleted(0, true);
      nextStep();
    } catch (err) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to verify serial number";
      setError("serialNumber", { message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Information section */}
      <p className="text-base tracking-wide mb-6">
        Register your bike to extend your warranty by 2 years, in addition to
        the 3-year standard coverage when compliant with our{" "}
        <a href="#" className="text-blue-500 underline">
          warranty policy.
        </a>{" "}
        Please visit our warranty policy page for more details.
      </p>

      {/* Serial number input */}
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
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Verification button */}
      <Button
        disabled={isDisabled}
        size="lg"
        className="tracking-wider self-end min-w-40"
        type="button"
        onClick={handleVerify}
      >
        {isLoading ? (
          <LoaderCircle size={40} className="animate-spin size-6 font-bold" />
        ) : (
          "FIND MY BIKE"
        )}
      </Button>

      {/* Help section */}
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

export default SerialNumberStep;

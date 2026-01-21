import Image from "next/image";
import React, { memo } from "react";
import { useFormContext } from "react-hook-form";

import { BikeRegistrationFormData } from "../schemas/registration-schema";

interface BikeInfoCardProps {
  imageSize: number;
  showDescription?: boolean;
}

/**
 * Displays bike image with optional model description
 */
const BikeInfoCard = ({
  imageSize,
  showDescription = true,
}: BikeInfoCardProps): React.JSX.Element | undefined => {
  const form = useFormContext<BikeRegistrationFormData>();

  const serialNumber = form.getValues("serialNumber");
  const modelDescription = form.getValues("modelDescription");

  // Don't render if required data is missing
  if (!modelDescription || !serialNumber) {
    return;
  }

  return (
    <div className="flex my-4 gap-4 items-center">
      <Image
        width={imageSize}
        height={imageSize}
        src={`/assets/${serialNumber}.jpg`}
        className="border border-neutral-300"
        alt={modelDescription}
      />
      {showDescription && (
        <p className="font-bold text-lg">{modelDescription}</p>
      )}
    </div>
  );
};

export default memo(BikeInfoCard);

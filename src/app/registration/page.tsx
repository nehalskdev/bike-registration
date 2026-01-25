import { JSX } from "react";
import { Metadata } from "next";

import { StepperProvider } from "@/src/components/ui/stepper";
import RegistrationForm from "./form/registration-form";

export const metadata: Metadata = {
  title: "Bike Registration | SCOTT Sports",
  description:
    "Register your Scott bike to extend your warranty by 2 years. Complete the simple registration process to get additional coverage on your bike.",
  keywords:
    "bike registration, Scott bike, warranty extension, bicycle registration, bike warranty",
  authors: [{ name: "Scott Sports" }],
  openGraph: {
    title: "Bike Registration | SCOTT Sports",
    description: "Register your Scott bike to extend your warranty by 2 years.",
    type: "website",
    locale: "en_US",
    siteName: "Scott Sports",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bike Registration | SCOTT Sports",
    description: "Register your Scott bike to extend your warranty by 2 years.",
  },
  robots: "index, follow",
};

/**
 * Bike Registration Page
 * Main entry point for the multi-step bike registration process
 */
const BikeRegistrationPage = (): JSX.Element => (
  <div className="min-h-screen bg-neutral-50 py-8">
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-sm">
      <h1 className="text-3xl font-brandon md:text-5xl text-neutral-600 tracking-wider font-extrabold mb-12 text-center pt-8">
        BIKE REGISTRATION
      </h1>

      <StepperProvider isIndicatorButtonsAccessible={false} defaultStep={0}>
        <RegistrationForm />
      </StepperProvider>
    </div>
  </div>
);

export default BikeRegistrationPage;

"use client";

import { LoadingOverlay, Spinner } from "./styles";

const LoadingView = () => {
  return (
    <LoadingOverlay suppressHydrationWarning>
      <Spinner suppressHydrationWarning />
    </LoadingOverlay>
  );
};

export default LoadingView;

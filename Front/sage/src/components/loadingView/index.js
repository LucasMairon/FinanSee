"use client";

import { LoadingOverlay, Spinner } from "./styles";

const LoadingView = () => {
  return (
    <LoadingOverlay>
      <Spinner suppressHydrationWarning />
    </LoadingOverlay>
  );
};

export default LoadingView;

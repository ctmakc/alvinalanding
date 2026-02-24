import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders main heading and CTA", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /modern real estate strategy for ottawa buyers and sellers/i
      })
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /book a consultation/i })).toBeInTheDocument();
  });
});

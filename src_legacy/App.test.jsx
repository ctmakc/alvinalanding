import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the new hero and main CTA", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /ottawa real estate expert for buyers, sellers, and relocations/i
      })
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /book a consultation/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /get free guides/i }).length).toBeGreaterThan(0);
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the new hero and main CTA", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /ottawa real estate strategy with sharper positioning, calmer guidance, and stronger outcomes/i
      })
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /book a strategy call/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /get free guides/i })).toBeInTheDocument();
  });
});

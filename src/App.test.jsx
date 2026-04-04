import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
    window.localStorage.clear();
  });

  it("renders main heading and CTA", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /modern real estate strategy for ottawa buyers and sellers/i
      })
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /book a consultation/i })).toBeInTheDocument();
  });

  it("defaults to english without a lang query", () => {
    window.localStorage.setItem("locale", "ru");
    render(<App />);

    expect(document.documentElement.lang).toBe("en");
    expect(screen.getAllByRole("link", { name: /book a consultation/i }).length).toBeGreaterThan(0);
  });
});

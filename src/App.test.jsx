import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("renders main heading and CTA", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /modern real estate strategy for ottawa buyers and sellers/i
      })
    ).toBeInTheDocument();

    expect(screen.getAllByRole("link", { name: /book a consultation/i }).length).toBeGreaterThan(0);
  });

  it("defaults to english without a lang query", () => {
    window.localStorage.setItem("locale", "ru");
    render(<App />);

    expect(document.documentElement.lang).toBe("en");
    expect(screen.getAllByRole("link", { name: /book a consultation/i }).length).toBeGreaterThan(0);
  });

  it("configures the temporary form relay", () => {
    render(<App />);

    const form = document.querySelector("form.lead-form");
    expect(form).toHaveAttribute("action", "https://formsubmit.co/ctmakc@gmail.com");
    expect(form).toHaveAttribute("method", "POST");
    expect(document.querySelector('input[name="_next"]')).toHaveAttribute("value", `${window.location.origin}/thank-you.html?lang=en`);
  });
});

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

  it("submits the lead form successfully", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(window.history, "replaceState").mockImplementation(() => {});
    const assignMock = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        ...window.location,
        assign: assignMock,
        href: "http://localhost/"
      }
    });

    render(<App />);

    fireEvent.change(screen.getAllByLabelText(/^name$/i)[0], { target: { value: "Test Lead" } });
    fireEvent.change(screen.getAllByLabelText(/^email$/i)[0], { target: { value: "lead@example.com" } });
    fireEvent.change(screen.getAllByLabelText(/^i am interested in$/i)[0], {
      target: { value: "Buying in Ottawa" }
    });
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.click(screen.getAllByRole("button", { name: /send inquiry/i })[0]);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
  });
});

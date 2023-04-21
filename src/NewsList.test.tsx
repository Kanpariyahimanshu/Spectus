import { render, screen, waitFor } from "@testing-library/react";
import NewsList from "./NewsList";

describe("NewsList", () => {
  it("should render the list of news items", async () => {
    const mockNewsItems = [
      {
        title: "Mock News Item 1",
        author: "John Doe",
        created_at: "2022-04-19T12:00:00.000Z",
      },
      {
        title: "Mock News Item 2",
        author: "Jane Doe",
        created_at: "2022-04-18T12:00:00.000Z",
      },
    ];

    jest.spyOn(global, "fetch").mockResolvedValue({
      json: jest.fn().mockResolvedValue({ hits: mockNewsItems }),
    } as any);

    render(<NewsList />);
    const loader = screen.getByText("Loading...");
    expect(loader).toBeInTheDocument();
    await screen.findByText("Mock News Item 1");

    expect(screen.getByText("Mock News Item 1")).toBeInTheDocument();
    expect(screen.getByText("Author: John Doe")).toBeInTheDocument();
    expect(screen.getByText("19 Apr 2022")).toBeInTheDocument();
    expect(screen.getByText("Mock News Item 2")).toBeInTheDocument();
    expect(screen.getByText("Author: Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("18 Apr 2022")).toBeInTheDocument();
  });

  it("should display the loader when loading news items", async () => {
    const mockNewsItems = [
      {
        title: "Mock News Item 1",
        author: "John Doe",
        created_at: "2022-04-19T12:00:00.000Z",
      },
    ];

    jest.spyOn(global, "fetch").mockResolvedValue({
      json: jest.fn().mockResolvedValue({ hits: mockNewsItems }),
    } as any);

    render(<NewsList />);

    const loader = screen.getByText("Loading...");
    expect(loader).toBeInTheDocument();
    await screen.findByText("Mock News Item 1");
  });
});

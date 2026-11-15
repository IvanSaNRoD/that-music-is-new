import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PlayerSlot } from "./player-slot";

const url = "https://open.spotify.com/search/x";

describe("PlayerSlot", () => {
  it("says nothing is playing before the first play", () => {
    render(<PlayerSlot track={null} spotifyUrl={url} />);
    expect(screen.getByRole("complementary", { name: "Player" })).toHaveTextContent("Nothing playing yet.");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("shows the track and a Spotify hand-off with a full accessible name", () => {
    render(<PlayerSlot track={{ id: "t1", title: "Song", artists: "Artist" }} spotifyUrl={url} />);
    expect(screen.getByText("Song")).toBeInTheDocument();
    // jsdom's name computation drops the space before "(opens…"; Chromium keeps it (checked in e2e).
    const link = screen.getByRole("link", { name: /dig deeper on spotify\s*\(opens in a new tab\)/i });
    expect(link).toHaveAttribute("href", url);
    expect(link).toHaveAttribute("target", "_blank");
  });
});

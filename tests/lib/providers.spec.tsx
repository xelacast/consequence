// @vitest-environment happy-dom

import { render, cleanup } from "@testing-library/react";
import { test, describe, expect, afterEach } from "vitest";

import { DayProvider, useDayForm } from "~/lib/state/dayContext";

const DayProviderTestChildComponent = () => {
  const context = useDayForm(); // This is an array of React.FC nodes
  return context?.map(({ node, key }) => {
    const Node = node;
    return (
      <div key={key} data-testid="1">
        <Node />
      </div>
    );
  });
};

const TestRenderComponent = () => {
  return <div>Test node render me</div>;
};

describe("DayProvider", () => {
  afterEach(() => {
    cleanup();
  });
  test("Add initial state correctly", async () => {
    const initialState = [TestRenderComponent];
    const { getByText, getByTestId } = render(
      <DayProvider initialState={initialState}>
        <DayProviderTestChildComponent />
      </DayProvider>,
    );
    expect(getByText("Test node render me")).toBeTruthy();
    expect(getByText("Test node render me")).toBeInstanceOf(HTMLDivElement);
    expect(
      getByTestId("1").innerHTML.includes("Test node render me"),
    ).toBeTruthy();
  });
  test("Fails on no render of component. Initial state is empty", async () => {
    const { container } = render(
      <DayProvider>
        <DayProviderTestChildComponent />
      </DayProvider>,
    );
    expect(container.innerHTML.includes("Test node render me")).toBeFalsy();
  });
});

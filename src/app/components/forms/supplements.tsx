"use client";

import { useState } from "react";

export const SupplementForm = () => {
  const [inputs, setInputs] = useState<
    { supplementName: string; amount: string }[]
  >([]);
  const [supplementName, setSupplementName] = useState("");
  const [amount, setAmount] = useState("0");

  const handleAddInput = () => {
    setInputs([...inputs, { supplementName, amount }]);
  };

  return (
    <div>
      {inputs.map((input, index) => (
        <div key={index}>
          <label htmlFor={`${input.supplementName}-${index}`}>
            Supplement Name
            <input
              className="bg-slate-400"
              name={input.supplementName}
              id={`${input.supplementName}-${index}`}
              value={input.supplementName}
              onChange={(e) => setSupplementName(e.target.value)}
            />
          </label>
          <input
            placeholder="amount"
            name={input.amount}
            value={input.amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      ))}
      <button
        className="w-36 border-r-4 bg-black hover:bg-sky-700"
        onClick={handleAddInput}
      >
        Add Supplement
      </button>
    </div>
  );
};

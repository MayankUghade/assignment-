"use client";

import { useState } from "react";
import FormDialogue from "./FormDialogue";
import FormData from "../Dynamic-Form-Response.json";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <h1 className="text-5xl font-bold mb-3">
        Click on this button to open up a form
      </h1>
      <button
        onClick={openModal}
        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        Open
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center">
          <FormDialogue formData={FormData} closeModal={closeModal} />
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import UserImg from "../img/user-img.png";

import LoginModal from "./LoginModal";

function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const companyName = "Company Name";

  const openModal = () => {
    setIsModalOpen(true);
  };
  return (
    <div>
      <header className="sticky top-0 z-50 flex justify-between border-b py-4 px-8 bg-gray-500/30 items-center">
        {" "}
        <div className="flex">
          <img src={UserImg} alt="Logo" className="h-10" />
        </div>
        <div className="text-2xl font-bold">{companyName}</div>
        <button
          className="hover:cursor-pointer border rounded-2xl px-3 hover:shadow-md"
          onClick={openModal}
        >
          {" "}
          Sing in{" "}
        </button>
      </header>

      {/* Modal component would go here */}
      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default Header;

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/20/solid";
import { clearTokens } from "@/utils/auth";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    clearTokens()
    router.push("/");
  };

  return (
    <li className="hover:bg-gray-700 ml-4">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleLogout();
        }}
        className="flex items-center p-4"
      >
        <ArrowRightStartOnRectangleIcon className="w-5 h-5 mr-3" />
        Sair
      </a>
    </li>
  );
};

export default LogoutButton;

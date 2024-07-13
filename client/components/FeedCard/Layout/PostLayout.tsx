import { useCurrentUser } from "@/hooks/user";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { TbHomeBolt } from "react-icons/tb";
import { FaUserAstronaut } from "react-icons/fa";
import { AiFillThunderbolt } from "react-icons/ai";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import SearchForm from "./search";

interface PostSidebarButton {
  title: string;
  icon: React.ReactNode;
  link: string;
}

interface PostlayoutProps {
  children: React.ReactNode;
}

const Postlayout: React.FC<PostlayoutProps> = ({ children }) => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const sidebarMenuItems: PostSidebarButton[] = useMemo(
    () => [
      {
        title: "Home",
        icon: <TbHomeBolt className="w-8 h-8" />, // Adjust the size of the icon
        link: "/",
      },
      {
        title: "Profile",
        icon: <FaUserAstronaut className="w-8 h-8" />, // Adjust the size of the icon
        link: `/${user?.id}`,
      },
    ],
    [user?.id]
  );

  const handleLoginWithGoogle = useCallback(
    async (cred: any) => {
      const googleToken = cred.credential;
      if (!googleToken) return toast.error("Google token not found");

      const { verifyGoogleToken } = await graphqlClient.request(
        verifyUserGoogleTokenQuery,
        { token: googleToken }
      );

      toast.success("Verified Success");
      console.log(verifyGoogleToken);

      if (verifyGoogleToken) {
        window.localStorage.setItem("__thunder_token", verifyGoogleToken);
        window.location.reload();
        await queryClient.invalidateQueries(["current-user"]);
      }
    },
    [queryClient]
  );

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("__thunder_token");
    setIsAuthenticated(!!token);
  }, []);

  const logout = () => {
    localStorage.removeItem("__thunder_token");
    setIsAuthenticated(false);
    window.location.reload();
    toast.success("Logged Out");
  };

  return (
    <div className="grid grid-cols-12 h-screen bg-gray-900 text-white">
      <div className="col-span-3 flex flex-col items-center p-4 border-r border-gray-700">
        <div className="flex items-center mb-8">
          <AiFillThunderbolt className="w-16 h-16 text-yellow-400" />
        </div>
        <ul className="flex-grow">
          {sidebarMenuItems.map((item) => (
            <li key={item.title} className="mb-4">
              <Link href={item.link} className="flex items-center gap-4 p-3 rounded hover:bg-gray-800">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-lg">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
        {user && (
          <div className="flex items-center gap-4 p-3 bg-gray-800 rounded mt-auto">
            {user.profileImageURL && (
              <Image
                className="rounded-full"
                src={user.profileImageURL}
                alt="user-image"
                height={30}
                width={30}
              />
            )}
            <div>
              <h3 className="text-lg">
                {user.firstName} {user.lastName}
              </h3>
            </div>
          </div>
        )}
      </div>
      <div className="col-span-6 p-4 overflow-y-auto custom-scrollbar">
        {children}
      </div>
      <div className="col-span-3 p-4 flex flex-col">
        <div className="w-full p-4 bg-gray-800 rounded-lg mb-8">
          <h1 className="mb-4 text-2xl">{!user ? "New to ThunderLink?" : "Users you may know"}</h1>
          {!user ? (
            <GoogleLogin onSuccess={handleLoginWithGoogle} />
          ) : (
            user.recommendedUsers?.map((el: any) => (
              <div className="flex items-center gap-4 mb-4" key={el.id}>
                {el.profileImageURL && (
                  <Image
                    src={el.profileImageURL}
                    alt="user-image"
                    className="rounded-full"
                    width={60}
                    height={60}
                  />
                )}
                <div>
                  <div className="text-lg">
                    {el.firstName} {el.lastName}
                  </div>
                  <Link href={`/${el.id}`} className="bg-green-500 text-white text-sm px-4 py-1 rounded-lg">
                    View
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="w-full mt-8">
          <SearchForm />
        </div>
        <div className="w-full mt-8">
          <button
            className="w-32 bg-red-500 font-semibold text-base py-1 rounded-full px-4 ml-40"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #4a5568 #2d3748;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2d3748;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #4a5568;
          border-radius: 4px;
          border: 3px solid #4a5568;
        }
      `}</style>
    </div>
  );
};

export default Postlayout;

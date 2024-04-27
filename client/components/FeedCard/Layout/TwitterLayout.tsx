import { useCurrentUser } from "@/hooks/user";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { BiHash, BiHomeCircle, BiMoney, BiUser } from "react-icons/bi";
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import { SlOptions } from "react-icons/sl";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { AiFillThunderbolt } from "react-icons/ai";
import { TbHomeBolt } from "react-icons/tb";
import { FaUserAstronaut } from "react-icons/fa";
import SearchForm from "./search";





interface PostSidebarButton {
  title: string;
  icon: React.ReactNode;
  link: string;
}

interface PostlayoutProps {
  children: React.ReactNode;
}

const Postlayout: React.FC<PostlayoutProps> = (props) => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const sidebarMenuItems: PostSidebarButton[] = useMemo(
    () => [
      {
        title: "Home",
        icon: <TbHomeBolt />,
        link: "/",
      },
   
     
      {
        title: "Profile",
        icon: <FaUserAstronaut />,
        link: `/${user?.id}`,
      },
    
    ],
    [user?.id]
  );

  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      if (!googleToken) return toast.error(`Google token not found`);

      const { verifyGoogleToken } = await graphqlClient.request(
        verifyUserGoogleTokenQuery,
        { token: googleToken }
      );

      toast.success("Verified Success");
      console.log(verifyGoogleToken);

      if (verifyGoogleToken)
        window.localStorage.setItem("__thunder_token", verifyGoogleToken);
       window.location.reload() 
      await queryClient.invalidateQueries(["current-user"]);
    },
    [queryClient]
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Effect hook to check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('__thunder_token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [isAuthenticated]);

  // Function to log out the user
  const logout = () => {
    localStorage.removeItem('__thunder_token');
      
      setIsAuthenticated(false);
     
      window.location.reload()
      toast.success("LoggedOut")
    
  };

  

  
  
  
  return (
    <div>
      <div className="grid grid-cols-12 h-screen sm:px-56">
        <div className="mr-20 col-span-2 sm:col-span-3 pt-1 flex sm:justify-end pr-4 " >
          <div className="marginbox">
            <div className="thunder ml-12">
            
  
            <AiFillThunderbolt className="w-16 h-16" 
    style={{
      color: '#FFE62D',
      fontSize: "3rem",
      
      
    }}
  />

    
            </div>
            <div className="mt-20 text-xl pr-4">
              <ul>
                {sidebarMenuItems.map((item) => (
                  <li key={item.title}>
                    <Link
                      className="flex justify-start items-center gap-8 hover:bg-gray-800 rounded-full px-3 py-6 w-fit cursor-pointer mt-9"
                      
                      href={item.link}
                    >
                      <span className="text-5xl"> {item.icon}</span>
                      <span className="hidden sm:inline">{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-5 px-3">
               
                <button className="block sm:hidden bg-[#1d9bf0] font-semibold text-lg py-2 px-4 rounded-full w-full">
                
                </button>
              </div>
            </div>
          </div>
          {user && (
            <div  style={{marginRight: "44px"}}
            className=" head absolute bottom-5 flex gap-2 items-center bg-slate-800 px-3 py-2 rounded-full">
              {user && user.profileImageURL && (
                <Image
              
                className="rounded-full"
                  src={user?.profileImageURL}
                  alt="user-image"
                  height={30}
                  width={30}
                />
              )}
              <div className="hidden sm:block">
                <h3 className="text-xl">
                  {user.firstName} {user.lastName}
                </h3>
              </div>
            </div>
          )}
        </div>
        <div style={{minWidth: "45rem"}} className="style-3 col-span-10 sm:col-span-5 h-screen border-gray-600">
          {props.children}
        </div>
        
        <div style={{minWidth: "25rem", marginLeft: "200px", display:"flex",
        flexDirection: "column", justifyContent:"space-between", alignItems:"center"
                    
      
      }} className="sm:col-span-3 p-5">
          
          {!user ? (
            <div style={{minWidth: "300px"}} className="p-5 bg-slate-700 rounded-lg">
              <h1 className="my-2 text-2xl">New to Thunder Link?</h1>
              <GoogleLogin onSuccess={handleLoginWithGoogle} />
            </div>
          ) : (
            <div style={{ minWidth:"300px"}} className="px-4 py-3 bg-slate-800 rounded-lg">
              <h1 className="my-2 text-2xl mb-5">Users you may know</h1>
              {user?.recommendedUsers?.map((el:any) => (
                <div className="flex items-center gap-3 mt-2" key={el?.id}>
                  {el?.profileImageURL && (
                    <Image
                      src={el?.profileImageURL}
                      alt="user-image"
                      className="rounded-full"
                      width={60}
                      height={60}
                    />
                  )}
                  <div>
                    <div className="text-lg">
                      {el?.firstName} {el?.lastName}
                    </div>
                    <Link
                      href={`/${el?.id}`}
                      className="bg-white text-black text-sm px-5 py-1 w-full rounded-lg"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            
           
       
            </div>
          )}
       <div>
  
</div>
       <div><SearchForm/></div>
       <div className="">
       <button className="button-55 row-span-6 mt-20" onClick={logout}>

        Logout
       </button>
      </div> 
       </div>
        </div>
        
        
      </div>
      
    
  );
};

export default Postlayout;
